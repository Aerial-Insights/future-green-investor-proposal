export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Future Green Energy Group × International Petrotech and Investments Inc." className="w-6 h-6 object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="text-text-muted text-sm">Future Green Energy Group</span>
              <span className="text-text-dim text-xs flex items-center gap-1.5 mt-0.5">
                <span className="text-accent-gold">×</span>
                <span>International Petrotech and Investments Inc.</span>
              </span>
            </div>
          </div>
          <p className="text-text-dim text-xs">
            Confidential Investment Materials — For Qualified Investors Only
          </p>
        </div>
      </div>
    </footer>
  )
}
