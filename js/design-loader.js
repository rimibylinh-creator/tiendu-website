(function() {
  try {
    const d = JSON.parse(localStorage.getItem('tiendu_design') || '{}')
    if (!Object.keys(d).length) return
    const vars = []
    if (d.colorPrimary)    vars.push(`--color-primary:${d.colorPrimary}`)
    if (d.colorPrimaryDark) vars.push(`--color-primary-dark:${d.colorPrimaryDark}`)
    if (d.colorNavBg)      vars.push(`--color-nav-bg:${d.colorNavBg}`)
    if (d.colorText)       vars.push(`--color-text:${d.colorText}`)
    if (d.colorBgSoft)     vars.push(`--color-bg-soft:${d.colorBgSoft}`)
    if (d.radiusPill)      vars.push(`--radius-pill:${d.radiusPill}px`)
    if (d.radiusLg)        vars.push(`--radius-lg:${d.radiusLg}px`)
    if (d.radiusMd)        vars.push(`--radius-md:${d.radiusMd}px`)
    if (d.fontBody)        vars.push(`--font-body:'${d.fontBody}',sans-serif`)
    if (d.fontCta)         vars.push(`--font-cta:'${d.fontCta}',sans-serif`)

    // Nav bg override (not a CSS var in original, use class)
    if (d.colorNavBg) {
      const navStyle = `.site-nav{background:${d.colorNavBg}!important}`
      vars.push(navStyle.replace(/;/g,';;')) // placeholder approach
    }

    if (vars.length) {
      const style = document.createElement('style')
      style.id = 'tiendu-design-overrides'
      style.textContent = `:root{${vars.filter(v => !v.includes('site-nav')).join(';')}}`
      if (d.colorNavBg) style.textContent += `.site-nav{background:${d.colorNavBg}!important}`
      if (d.fontBody) style.textContent += `@import url('https://fonts.googleapis.com/css2?family=${d.fontBody.replace(/ /g,'+')}:wght@400;500;600;700&display=swap');`
      if (d.fontCta && d.fontCta !== d.fontBody) style.textContent += `@import url('https://fonts.googleapis.com/css2?family=${d.fontCta.replace(/ /g,'+')}:wght@700&display=swap');`
      document.head.appendChild(style)
    }
  } catch(e) {}
})()
