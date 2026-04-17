interface FlagImageProps {
  flagImagePath: string
  isoCode?: string
  alt: string
  size?: 'thumb' | 'card' | 'pdp'
}

// Inline SVGs for specialty flags that don't have external sources
const svgFlags: Record<string, string> = {
  'specialty/ics-alpha.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1.5" height="2" fill="#003087"/><rect x="1.5" width="1.5" height="2" fill="white"/></svg>`,
  'specialty/ics-bravo.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#E8112d"/></svg>`,
  'specialty/ics-quebec.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#F7D117"/></svg>`,
  'specialty/ics-oscar.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><polygon points="0,0 3,2 0,2" fill="#E8112d"/><polygon points="0,0 3,0 3,2" fill="#FF6600"/></svg>`,
  'specialty/golf-white.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="white" stroke="#ddd" stroke-width="0.05"/><line x1="0.1" y1="1" x2="2.9" y2="1" stroke="#ddd" stroke-width="0.05"/></svg>`,
  'specialty/golf-numbered.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="white" stroke="#ddd" stroke-width="0.05"/><text x="1.5" y="1.5" text-anchor="middle" font-size="1.2" font-family="Arial" font-weight="bold" fill="#222">7</text></svg>`,
  'specialty/golf-striped.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="white"/><rect y="0" width="3" height="0.4" fill="#E8112d"/><rect y="0.8" width="3" height="0.4" fill="#E8112d"/><rect y="1.6" width="3" height="0.4" fill="#E8112d"/></svg>`,
  'specialty/golf-tournament.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#003087"/><text x="1.5" y="1.3" text-anchor="middle" font-size="0.7" font-family="Arial" font-weight="bold" fill="gold">PGA</text></svg>`,
  'specialty/us-army.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#1B2A4A"/><text x="1.5" y="0.9" text-anchor="middle" font-size="0.45" font-family="Arial" font-weight="bold" fill="#FFD700">U.S. ARMY</text><text x="1.5" y="1.4" text-anchor="middle" font-size="0.3" font-family="Arial" fill="#FFD700">EST. 1775</text></svg>`,
  'specialty/us-navy.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#003087"/><text x="1.5" y="0.9" text-anchor="middle" font-size="0.45" font-family="Arial" font-weight="bold" fill="#FFD700">U.S. NAVY</text><text x="1.5" y="1.4" text-anchor="middle" font-size="0.25" font-family="Arial" fill="#FFD700">HONOR · COURAGE · COMMITMENT</text></svg>`,
  'specialty/us-marines.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#8B0000"/><text x="1.5" y="0.85" text-anchor="middle" font-size="0.4" font-family="Arial" font-weight="bold" fill="#FFD700">U.S. MARINES</text><text x="1.5" y="1.35" text-anchor="middle" font-size="0.25" font-family="Arial" fill="#FFD700">SEMPER FIDELIS</text></svg>`,
  'specialty/us-air-force.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#003087"/><text x="1.5" y="0.85" text-anchor="middle" font-size="0.35" font-family="Arial" font-weight="bold" fill="#FFD700">U.S. AIR FORCE</text><text x="1.5" y="1.35" text-anchor="middle" font-size="0.22" font-family="Arial" fill="#FFD700">AIM HIGH · FLY · FIGHT · WIN</text></svg>`,
  'specialty/us-coast-guard.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="white"/><rect width="3" height="0.5" fill="#003087"/><text x="1.5" y="1.25" text-anchor="middle" font-size="0.35" font-family="Arial" font-weight="bold" fill="#003087">U.S. COAST GUARD</text></svg>`,
  'specialty/us-space-force.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#1a1a2e"/><text x="1.5" y="0.85" text-anchor="middle" font-size="0.35" font-family="Arial" font-weight="bold" fill="#C0C0C0">U.S. SPACE FORCE</text><text x="1.5" y="1.35" text-anchor="middle" font-size="0.22" font-family="Arial" fill="#C0C0C0">SEMPER SUPRA</text></svg>`,
  'specialty/betsy-ross.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 10"><rect width="19" height="10" fill="#B22234"/><rect y="0.77" width="19" height="0.77" fill="white"/><rect y="2.31" width="19" height="0.77" fill="white"/><rect y="3.85" width="19" height="0.77" fill="white"/><rect y="5.38" width="19" height="0.77" fill="white"/><rect y="6.92" width="19" height="0.77" fill="white"/><rect y="8.46" width="19" height="0.77" fill="white"/><rect width="7.6" height="5.38" fill="#3C3B6E"/><circle cx="3.8" cy="2.69" r="1.8" fill="none" stroke="white" stroke-width="0.15"/></svg>`,
  'specialty/gadsden.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#FFD700"/><text x="1.5" y="1.15" text-anchor="middle" font-size="0.6" font-family="serif">🐍</text><text x="1.5" y="1.75" text-anchor="middle" font-size="0.25" font-family="Arial" font-weight="bold" fill="#333">DONT TREAD ON ME</text></svg>`,
  'specialty/grand-union.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 10"><rect width="19" height="10" fill="#B22234"/><rect y="0.77" width="19" height="0.77" fill="white"/><rect y="2.31" width="19" height="0.77" fill="white"/><rect y="3.85" width="19" height="0.77" fill="white"/><rect y="5.38" width="19" height="0.77" fill="white"/><rect y="6.92" width="19" height="0.77" fill="white"/><rect y="8.46" width="19" height="0.77" fill="white"/><rect width="7.6" height="5.38" fill="#012169"/><line x1="0" y1="0" x2="7.6" y2="5.38" stroke="white" stroke-width="0.8"/><line x1="7.6" y1="0" x2="0" y2="5.38" stroke="white" stroke-width="0.8"/></svg>`,
  'specialty/bonnie-blue.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#003087"/><text x="1.5" y="1.2" text-anchor="middle" font-size="1.2" font-family="Arial" fill="white">★</text></svg>`,
  'specialty/first-navy-jack.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 10"><rect width="19" height="10" fill="#B22234"/><rect y="0.77" width="19" height="0.77" fill="white"/><rect y="2.31" width="19" height="0.77" fill="white"/><rect y="3.85" width="19" height="0.77" fill="white"/><rect y="5.38" width="19" height="0.77" fill="white"/><rect y="6.92" width="19" height="0.77" fill="white"/><rect y="8.46" width="19" height="0.77" fill="white"/><line x1="0" y1="0" x2="19" y2="10" stroke="#4a7c3f" stroke-width="1.5"/><line x1="0" y1="10" x2="19" y2="0" stroke="#4a7c3f" stroke-width="1.5"/></svg>`,
  'specialty/garden-spring.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#e8f5e9"/><text x="1.5" y="1.2" text-anchor="middle" font-size="0.9">🌷</text></svg>`,
  'specialty/garden-fall.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff3e0"/><text x="1.5" y="1.2" text-anchor="middle" font-size="0.9">🍂</text></svg>`,
  'specialty/garden-patriotic.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#E8EAF6"/><text x="1.5" y="1.2" text-anchor="middle" font-size="0.9">⭐</text></svg>`,
  'specialty/garden-holiday.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#fce4ec"/><text x="1.5" y="1.2" text-anchor="middle" font-size="0.9">🎄</text></svg>`,
  'specialty/garden-welcome.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#f3e5f5"/><text x="1.5" y="1.0" text-anchor="middle" font-size="0.35" font-family="Arial" font-weight="bold" fill="#6a1b9a">WELCOME</text><text x="1.5" y="1.5" text-anchor="middle" font-size="0.6">🏠</text></svg>`,
  'specialty/garden-stake.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#f5f5f5"/><rect x="1.35" y="0.2" width="0.3" height="1.6" fill="#333" rx="0.05"/><rect x="1.1" y="1.6" width="0.8" height="0.2" fill="#333" rx="0.05"/></svg>`,
}

// Wikimedia-hosted state and specialty flags
const remoteFlags: Record<string, string> = {
  'states/california.svg': 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg',
  'states/texas.svg': 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg',
  'states/new-york.svg': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_New_York.svg',
  'states/florida.svg': 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
  'states/colorado.svg': 'https://upload.wikimedia.org/wikipedia/commons/4/46/Flag_of_Colorado.svg',
  'states/alaska.svg': 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Alaska.svg',
  'states/hawaii.svg': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Hawaii.svg',
  'states/montana.svg': 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_Montana.svg',
  'states/arizona.svg': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arizona.svg',
  'states/oregon.svg': 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Oregon.svg',
  'states/north-carolina.svg': 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_North_Carolina.svg',
  'states/georgia.svg': 'https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Georgia_%28U.S._state%29.svg',
  'states/washington-state.svg': 'https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Washington.svg',
  'states/vermont.svg': 'https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Vermont.svg',
  'states/virginia.svg': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Flag_of_Virginia.svg',
}

// Country flags via flag-icons CDN
const countryFlagCdn = (isoCode: string) =>
  `https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3/${isoCode}.svg`

export default function FlagImage({ flagImagePath, isoCode, alt, size = 'card' }: FlagImageProps) {
  const containerClass = {
    thumb: 'w-16 h-12 p-1',
    card: 'w-full aspect-[4/3] p-4',
    pdp: 'w-full aspect-[4/3] p-8',
  }[size]

  const imgClass = {
    thumb: 'max-h-10 max-w-full',
    card: 'max-h-36 max-w-full',
    pdp: 'max-h-72 max-w-full',
  }[size]

  // Determine image source
  let src: string | null = null
  let svgContent: string | null = null

  if (isoCode && flagImagePath.startsWith('country/')) {
    src = countryFlagCdn(isoCode)
  } else if (remoteFlags[flagImagePath]) {
    src = remoteFlags[flagImagePath]
  } else if (svgFlags[flagImagePath]) {
    svgContent = svgFlags[flagImagePath]
  }

  return (
    <div className={`${containerClass} bg-gray-100 rounded-lg flex items-center justify-center shadow-sm overflow-hidden`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${imgClass} object-contain drop-shadow-sm`}
          loading="lazy"
        />
      ) : svgContent ? (
        <div
          className={`${imgClass} object-contain drop-shadow-sm`}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div className="text-gray-400 text-sm">🏳️</div>
      )}
    </div>
  )
}
