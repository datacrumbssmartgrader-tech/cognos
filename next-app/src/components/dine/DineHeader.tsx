"use client";

interface DineHeaderProps {
  tableNumber: string;
  onCallWaiter: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  showSearch?: boolean; // New optional property configuration flag
}

export default function DineHeader({
  tableNumber,
  onCallWaiter,
  searchValue,
  onSearchChange,
  onClearSearch,
  showSearch = true, // Defaults to true if left unprovided
}: DineHeaderProps) {
  return (
    <div className="menu-top">
      <div style={{ height: "15dvh" }} />

      <div>
        <header className="app-header">
          <div className="header-left">
            <span className="header-logo">ROOSTER&apos;S DEN</span>
            <span className="header-table">{tableNumber}</span>
          </div>

          <div className="header-right">
            <button
              className="icon-btn btn-call-waiter-header"
              aria-label="Call Waiter"
              onClick={onCallWaiter}
            >
              <i className="ri-service-line" />
            </button>
          </div>
        </header>

        {/* Conditionally reveal or hide search inputs securely based on active tab view context */}
        {showSearch && (
          <div className="search-wrap">
            <i className="ri-search-line search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search dishes…"
              autoComplete="off"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <button
              className="search-clear"
              hidden={!searchValue}
              onClick={onClearSearch}
            >
              <i className="ri-close-line" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}