
"use client";

import { useMemo, useState } from "react";

const donationAmounts = [1000, 2500, 5000, 10000, 25000, 50000];

const taxSlabs = [
    { label: "5% tax slab", rate: 5 },
    { label: "20% tax slab", rate: 20 },
    { label: "30% tax slab", rate: 30 },
];

const impactTiers = [
    { amount: 500, title: "Care essentials", description: "Helps provide everyday essentials for people or animals in need." },
    { amount: 1000, title: "Community support", description: "Supports local welfare activities and essential supplies." },
    { amount: 2500, title: "Extended care", description: "Helps fund ongoing care, outreach, and community initiatives." },
];

const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);

export default function Section80GPage() {
    const [donation, setDonation] = useState(5000);
    const [customAmount, setCustomAmount] = useState("");
    const [taxRate, setTaxRate] = useState(30);
    const [eligible, setEligible] = useState(true);

    const calculation = useMemo(() => {
        // Illustrative estimate: assumes a fully eligible 50% deduction,
        // no qualifying-limit restriction, and the selected marginal tax rate.
        const deduction = eligible ? donation * 0.5 : 0;
        const effectiveRate = taxRate * 1.04;
        const taxSaved = (deduction * effectiveRate) / 100;

        return {
            deduction,
            taxSaved,
            netCost: donation - taxSaved,
            effectiveRate,
        };
    }, [donation, taxRate, eligible]);

    function selectAmount(amount) {
        setDonation(amount);
        setCustomAmount("");
    }

    function updateCustomAmount(value) {
        setCustomAmount(value);

        const amount = Number(value);
        if (value !== "" && Number.isFinite(amount) && amount >= 0) {
            setDonation(Math.min(Math.floor(amount), 10000000));
        }
    }

    return (
        <main className="min-h-screen bg-[#f8faf7] text-slate-900">
            {/* Hero */}
            <section className="relative overflow-hidden bg-[#123e32] px-5 py-16 text-white sm:py-24">
                <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
                <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
                    <div>
                        <p className="mb-5 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm text-emerald-100">
                            DONATE WITH PURPOSE
                        </p>
                        <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
                            Your kindness can make a lasting difference.
                        </h1>
                        <p className="mt-6 max-w-lg text-base leading-7 text-emerald-50/85 sm:text-lg">
                            Support our charitable initiatives and explore how an eligible
                            donation may reduce your taxable income under Section 80G.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="#calculator"
                                className="rounded-xl bg-white px-6 py-3.5 font-semibold text-[#123e32] transition hover:bg-emerald-50"
                            >
                                Calculate tax savings
                            </a>
                            <a
                                href="#impact"
                                className="rounded-xl border border-white/30 px-6 py-3.5 font-semibold transition hover:bg-white/10"
                            >
                                See your impact
                            </a>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-7 shadow-2xl backdrop-blur-sm sm:p-9">
                        <div className="text-5xl" aria-hidden="true">♡</div>
                        <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-emerald-200">
                            Every contribution matters
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold">
                            Give with purpose. Create change.
                        </h2>
                        <p className="mt-4 leading-7 text-emerald-50/80">
                            Your support helps us work towards a more compassionate and
                            caring community. Together, we can turn generosity into action.
                        </p>
                        <div className="mt-7 border-t border-white/15 pt-5 text-sm text-emerald-100/80">
                            Tax benefits are subject to eligibility and applicable law.
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust / benefits */}
            <section className="mx-auto grid max-w-6xl gap-4 px-5 py-10 sm:grid-cols-3">
                {[
                    {
                        number: "01",
                        title: "Support a cause",
                        text: "Contribute towards meaningful charitable work.",
                    },
                    {
                        number: "02",
                        title: "Explore tax benefits",
                        text: "Estimate potential savings on eligible donations.",
                    },
                    {
                        number: "03",
                        title: "Give confidently",
                        text: "Check the organisation's approval and documentation.",
                    },
                ].map((item) => (
                    <article
                        key={item.number}
                        className="rounded-2xl border border-slate-200 bg-white p-6"
                    >
                        <span className="text-sm font-semibold text-emerald-700">
                            {item.number}
                        </span>
                        <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {item.text}
                        </p>
                    </article>
                ))}
            </section>

            {/* Calculator */}
            <section id="calculator" className="scroll-mt-8 px-5 py-14 sm:py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto mb-10 max-w-2xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                            Interactive calculator
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            Understand your potential tax savings
                        </h2>
                        <p className="mt-4 leading-7 text-slate-600">
                            Choose a donation amount and an illustrative tax rate to see
                            how an eligible Section 80G deduction could affect your tax.
                        </p>
                    </div>

                    <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                        {/* Inputs */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <label className="text-sm font-semibold text-slate-800">
                                1. Choose your donation amount
                            </label>

                            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {donationAmounts.map((amount) => (
                                    <button
                                        type="button"
                                        key={amount}
                                        onClick={() => selectAmount(amount)}
                                        aria-pressed={donation === amount && customAmount === ""}
                                        className={`rounded-xl border px-3 py-4 text-sm font-semibold transition ${donation === amount && customAmount === ""
                                                ? "border-emerald-700 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-700"
                                                : "border-slate-200 text-slate-700 hover:border-emerald-600"
                                            }`}
                                    >
                                        {formatINR(amount)}
                                    </button>
                                ))}
                            </div>

                            <label
                                htmlFor="custom-amount"
                                className="mt-6 block text-sm font-semibold text-slate-800"
                            >
                                Or enter a custom amount (₹)
                            </label>
                            <input
                                id="custom-amount"
                                type="number"
                                min="0"
                                max="10000000"
                                step="1"
                                inputMode="numeric"
                                value={customAmount}
                                onChange={(event) => updateCustomAmount(event.target.value)}
                                placeholder="Enter donation amount"
                                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                            />

                            <div className="my-8 border-t border-slate-100" />

                            <label
                                htmlFor="tax-rate"
                                className="text-sm font-semibold text-slate-800"
                            >
                                2. Select your illustrative marginal tax rate
                            </label>
                            <select
                                id="tax-rate"
                                value={taxRate}
                                onChange={(event) => setTaxRate(Number(event.target.value))}
                                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                            >
                                {taxSlabs.map((slab) => (
                                    <option key={slab.rate} value={slab.rate}>
                                        {slab.label} — {slab.rate === 30 ? "31.2%" : slab.rate === 20 ? "20.8%" : "5.2%"} including 4% cess
                                    </option>
                                ))}
                            </select>

                            <div className="my-8 border-t border-slate-100" />

                            <label className="flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={eligible}
                                    onChange={(event) => setEligible(event.target.checked)}
                                    className="mt-1 h-4 w-4 accent-emerald-700"
                                />
                                <span>
                                    <span className="block text-sm font-semibold">
                                        Assume my donation qualifies for a 50% deduction
                                    </span>
                                    <span className="mt-1 block text-sm leading-6 text-slate-500">
                                        This is an assumption for estimation, not a verification
                                        of your eligibility.
                                    </span>
                                </span>
                            </label>
                        </div>

                        {/* Results */}
                        <aside
                            aria-live="polite"
                            className="rounded-3xl bg-[#123e32] p-6 text-white shadow-xl sm:p-8"
                        >
                            <p className="text-sm font-medium text-emerald-200">
                                Estimated tax benefit
                            </p>
                            <p className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                                {formatINR(calculation.taxSaved)}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-emerald-50/75">
                                Illustrative savings using a {taxRate}% marginal tax rate,
                                including an assumed 4% cess on that rate.
                            </p>

                            <div className="my-8 border-t border-white/20" />

                            <div className="space-y-5">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-emerald-50/80">
                                        Your donation
                                    </span>
                                    <strong className="text-lg">
                                        {formatINR(donation)}
                                    </strong>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-emerald-50/80">
                                        Assumed eligible deduction
                                    </span>
                                    <strong>{formatINR(calculation.deduction)}</strong>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-emerald-50/80">
                                        Estimated tax savings
                                    </span>
                                    <strong className="text-emerald-200">
                                        {formatINR(calculation.taxSaved)}
                                    </strong>
                                </div>
                            </div>

                            <div className="mt-8 rounded-2xl bg-white p-5 text-slate-900">
                                <p className="text-sm text-slate-600">
                                    Estimated effective cost after tax savings
                                </p>
                                <p className="mt-2 text-3xl font-bold">
                                    {formatINR(calculation.netCost)}
                                </p>
                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                    This estimate is not a guaranteed tax outcome. Your actual
                                    tax liability may differ.
                                </p>
                            </div>
                        </aside>
                    </div>

                    <p className="mx-auto mt-6 max-w-4xl text-xs leading-6 text-slate-500">
                        Calculation assumes the selected rate is your applicable marginal
                        rate, the full donation qualifies for a 50% deduction, the
                        deduction is within any applicable limit, and the 4% cess applies
                        to the relevant tax amount. It excludes surcharge, tax rebates,
                        marginal relief, and other tax interactions. Actual savings may
                        be lower or nil.
                    </p>
                </div>
            </section>

            {/* Impact */}
            <section id="impact" className="scroll-mt-8 bg-white px-5 py-16 sm:py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                            Your contribution matters
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            Make generosity go further.
                        </h2>
                        <p className="mt-4 leading-7 text-slate-600">
                            Donations help foundations deliver essential services, care,
                            and support. The examples below are illustrative; actual
                            outcomes depend on your organisation's programmes and costs.
                        </p>
                    </div>

                    <div className="mt-9 grid gap-5 md:grid-cols-3">
                        {impactTiers.map((tier) => (
                            <article
                                key={tier.amount}
                                className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl text-emerald-800">
                                    ♡
                                </div>
                                <p className="mt-5 text-2xl font-bold">
                                    {formatINR(tier.amount)}
                                </p>
                                <h3 className="mt-2 text-lg font-semibold">{tier.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {tier.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Compliance */}
            <section className="px-5 py-16 sm:py-20">
                <div className="mx-auto max-w-4xl">
                    <div className="text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                            Important information
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight">
                            Know the Section 80G rules
                        </h2>
                    </div>

                    <div className="mt-8 space-y-4">
                        {[
                            {
                                title: "Eligible organisation",
                                text: "The institution must hold valid Section 80G approval for the relevant period, and the particular donation must qualify under the applicable rules.",
                            },
                            {
                                title: "Old tax regime",
                                text: "Section 80G deductions are generally available under the old tax regime, subject to the applicable statutory requirements.",
                            },
                            {
                                title: "Cash donation limit",
                                text: "Cash donations exceeding ₹2,000 are not eligible for Section 80G deduction. Use an eligible non-cash payment method and retain proof.",
                            },
                            {
                                title: "50% deduction and qualifying limits",
                                text: "Not all eligible donations receive the same treatment. Some qualify for a 50% deduction subject to a 10% adjusted gross total income limit; others may have different rules.",
                            },
                            {
                                title: "Receipt and tax certificate",
                                text: "Retain the donation receipt and verify the institution's applicable reporting and Form 10BE requirements. A certificate does not override eligibility rules.",
                            },
                        ].map((item) => (
                            <details
                                key={item.title}
                                className="group rounded-2xl border border-slate-200 bg-white px-5 py-4"
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                                    {item.title}
                                    <span className="text-xl text-emerald-700 transition group-open:rotate-45">
                                        +
                                    </span>
                                </summary>
                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {item.text}
                                </p>
                            </details>
                        ))}
                    </div>

                    <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
                        <strong>Tax disclaimer:</strong> This calculator is for
                        educational purposes only and is not tax advice. Consult a
                        qualified tax professional to confirm eligibility, deduction
                        limits, the applicable tax regime, and actual tax savings.
                    </div>
                </div>
            </section>

            {/* Closing CTA */}
            <section className="px-5 pb-16">
                <div className="mx-auto max-w-6xl rounded-3xl bg-emerald-100 px-6 py-10 text-center sm:px-12 sm:py-14">
                    <h2 className="text-3xl font-bold tracking-tight text-[#123e32] sm:text-4xl">
                        Be a part of something meaningful.
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-700">
                        Your support can help build a kinder, stronger community.
                        Every eligible contribution is an opportunity to make a difference.
                    </p>
                    <a
                        href="/donate"
                        className="mt-7 inline-flex rounded-xl bg-[#123e32] px-7 py-3.5 font-semibold text-white transition hover:bg-emerald-900"
                    >
                        Donate now
                    </a>
                </div>
            </section>

            <footer className="border-t border-slate-200 bg-white px-5 py-6 text-center text-sm text-slate-500">
                © {new Date().getFullYear()} Your Foundation. All rights reserved.
            </footer>
        </main>
    );
}
