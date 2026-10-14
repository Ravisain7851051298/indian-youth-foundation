const { deleteDocumentFiles } = require('../../utils/fileCleaner');

/**
 * Mongoose plugin that automatically deletes any attached files from the uploads
 * directory whenever a document is deleted via findByIdAndDelete, findOneAndDelete,
 * or doc.deleteOne()
 */
function fileCleanupPlugin(schema) {
  // Post-hook for query-based deletion: Model.findByIdAndDelete, Model.findOneAndDelete
  schema.post('findOneAndDelete', async function (doc) {
    if (doc) {
      try {
        await deleteDocumentFiles(doc);
      } catch (err) {
        console.error('⚠️ [FileCleanupPlugin] Error cleaning files for deleted document:', err.message);
      }
    }
  });

  // Post-hook for doc.deleteOne()
  schema.post('deleteOne', { document: true, query: false }, async function () {
    try {
      await deleteDocumentFiles(this);
    } catch (err) {
      console.error('⚠️ [FileCleanupPlugin] Error cleaning files for doc.deleteOne:', err.message);
    }
  });
}

module.exports = fileCleanupPlugin;
