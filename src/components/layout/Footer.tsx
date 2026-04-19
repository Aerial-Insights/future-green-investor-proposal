export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-gold to-accent-gold-dim flex items-center justify-center">
              <span className="text-surface font-display font-bold text-xs">U</span>
            </div>
            <span className="text-text-muted text-sm">Unity Capital Group</span>
          </div>
          <p className="text-text-dim text-xs">
            Confidential Investment Materials — For Qualified Investors Only
          </p>
        </div>
      </div>
    </footer>
  )
}
