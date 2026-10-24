const { deleteDocumentFiles, deleteFileByUrl, extractFileUrls } = require('../../utils/fileCleaner');

/**
 * Advanced Mongoose File Cleanup Plugin
 * Automatically performs two essential file maintenance tasks:
 * 1. Document Deletion: Deletes any attached uploaded files from disk when a document is deleted
 *    via findByIdAndDelete, findOneAndDelete, doc.deleteOne(), or Model.deleteMany().
 * 2. Document Update: Detects when existing file fields (photoUrl, documentFront, paymentScreenshot, etc.)
 *    are replaced with new file URLs, and automatically unlinks the old replaced file from disk.
 */
function fileCleanupPlugin(schema) {
  // -------------------------------------------------------------
  // 1. UPDATE CLEANUP: Clean replaced files on findOneAndUpdate / findByIdAndUpdate
  // -------------------------------------------------------------
  schema.pre('findOneAndUpdate', async function () {
    try {
      // Fetch the existing document before update is committed
      const existingDoc = await this.model.findOne(this.getQuery()).lean();
      if (existingDoc) {
        this._oldFilesToCompare = extractFileUrls(existingDoc);
      }
    } catch (err) {
      // Non-fatal, do not fail update query
    }
  });

  schema.post('findOneAndUpdate', async function (updatedDoc) {
    if (this._oldFilesToCompare && this._oldFilesToCompare.size > 0 && updatedDoc) {
      try {
        const newFiles = extractFileUrls(updatedDoc);
        for (const oldFileUrl of this._oldFilesToCompare) {
          // If the old file is no longer present in the updated document, it was replaced -> delete it!
          if (!newFiles.has(oldFileUrl)) {
            await deleteFileByUrl(oldFileUrl);
          }
        }
      } catch (err) {
        console.error('⚠️ [FileCleanupPlugin] Error cleaning replaced files on findOneAndUpdate:', err.message);
      }
    }
  });

  // -------------------------------------------------------------
  // 2. UPDATE CLEANUP: Clean replaced files on doc.save() (when doc was modified)
  // -------------------------------------------------------------
  schema.pre('save', async function () {
    if (!this.isNew) {
      try {
        const originalDoc = await this.constructor.findById(this._id).lean();
        if (originalDoc) {
          this._preSaveOldFiles = extractFileUrls(originalDoc);
        }
      } catch (err) {
        // Non-fatal
      }
    }
  });

  schema.post('save', async function () {
    if (this._preSaveOldFiles && this._preSaveOldFiles.size > 0) {
      try {
        const currentFiles = extractFileUrls(this);
        for (const oldFileUrl of this._preSaveOldFiles) {
          if (!currentFiles.has(oldFileUrl)) {
            await deleteFileByUrl(oldFileUrl);
          }
        }
      } catch (err) {
        console.error('⚠️ [FileCleanupPlugin] Error cleaning replaced files on save:', err.message);
      } finally {
        this._preSaveOldFiles = null;
      }
    }
  });

  // -------------------------------------------------------------
  // 3. DELETION CLEANUP: Query-based deletion (findOneAndDelete, findByIdAndDelete)
  // -------------------------------------------------------------
  schema.post('findOneAndDelete', async function (doc) {
    if (doc) {
      try {
        await deleteDocumentFiles(doc);
      } catch (err) {
        console.error('⚠️ [FileCleanupPlugin] Error cleaning files on findOneAndDelete:', err.message);
      }
    }
  });

  // -------------------------------------------------------------
  // 4. DELETION CLEANUP: Document-based deletion (doc.deleteOne())
  // -------------------------------------------------------------
  schema.post('deleteOne', { document: true, query: false }, async function () {
    try {
      await deleteDocumentFiles(this);
    } catch (err) {
      console.error('⚠️ [FileCleanupPlugin] Error cleaning files on doc.deleteOne:', err.message);
    }
  });

  // -------------------------------------------------------------
  // 5. DELETION CLEANUP: Batch deletion (Model.deleteMany())
  // -------------------------------------------------------------
  schema.pre('deleteMany', async function () {
    try {
      const docsToDelete = await this.model.find(this.getQuery());
      if (docsToDelete && docsToDelete.length > 0) {
        for (const doc of docsToDelete) {
          await deleteDocumentFiles(doc);
        }
      }
    } catch (err) {
      console.error('⚠️ [FileCleanupPlugin] Error cleaning files on deleteMany:', err.message);
    }
  });
}

module.exports = fileCleanupPlugin;
