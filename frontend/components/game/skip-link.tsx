"use client"

export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link" onFocus={(e) => e.target.scrollIntoView()}>
      Skip to main content
    </a>
  )
}
