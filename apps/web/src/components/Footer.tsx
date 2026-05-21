export function Footer() {
    return (
        <footer className="border-t border-border bg-surface-low px-8 py-8">
        <div className="w-full mx-auto flex flex-wrap justify-between items-start gap-8">
          <div>
            <p className="font-serif m-0 mb-1">Duckrates</p>
            <p className="font-sans text-xs text-muted m-0">
              &copy; {new Date().getFullYear()} Duckrates
            </p>
          </div>
          <nav className="flex gap-6 font-sans text-xs text-muted">
            <a href="#">Masthead</a>
            <a href="#">Legal</a>
            <a href="#">Privacy</a>
          </nav>
        </div>
      </footer>
    );
}