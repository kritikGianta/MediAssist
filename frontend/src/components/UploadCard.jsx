import { FileUp } from "lucide-react";

export default function UploadCard({ onFile, loading, summary }) {
  return (
    <div className="glass rounded-[28px] p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-2xl bg-[#eef7f4] p-3">
          <FileUp className="text-aqua" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-ink">PDF report summary</h3>
          <p className="text-sm text-mist">Upload blood reports, prescriptions, or health PDFs.</p>
        </div>
      </div>
      <label className="flex cursor-pointer items-center justify-center rounded-3xl border border-dashed border-[#18364020] bg-[#fbfaf7] px-4 py-8 text-center text-sm text-mist transition hover:border-aqua/40">
        <input type="file" accept=".pdf" className="hidden" onChange={(event) => onFile(event.target.files?.[0])} />
        {loading ? "Reading PDF..." : "Choose a PDF file"}
      </label>
      {summary ? (
        <div className="mt-4 rounded-3xl border border-[#18364014] bg-white p-4 text-sm text-ink whitespace-pre-line shadow-card">
          {summary}
        </div>
      ) : null}
    </div>
  );
}
