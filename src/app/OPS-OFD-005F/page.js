import { Suspense } from "react";
import DeclarationSTSTerminal from "./DeclarationSTSTerminal";

export default function DeclarationSTSTerminalPage() {
  return (
    <div >
      {/* Sidebar */}
      <Suspense
        fallback={
          <div >
            <p className="text-white/60">
              Loading Declaration STS Terminal page…
            </p>
          </div>
        }
      >
        <DeclarationSTSTerminal />
      </Suspense>
    </div>
  );
}
