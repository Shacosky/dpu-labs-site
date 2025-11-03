export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/5">
      <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-neutral-400">
          © {new Date().getFullYear()} DPU Labs SpA. All rights reserved.
        </p>
        <p className="text-sm text-neutral-500">
          Peru • Mexico • Remote LATAM
        </p>
      </div>
    </footer>
  );
}

