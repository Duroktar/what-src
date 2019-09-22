import * as React from 'react'
import { NPM } from './npm'
import { GitHub } from './github'
import { Link } from './link'

const links = [
  { href: 'https://www.npmjs.com/package/@what-src/plugin', label: 'NPM', component: NPM },
  { href: '#', label: '' },
  { href: 'https://github.com/duroktar/what-src', label: 'GitHub', component: GitHub },
].map(link => {
  return {
    ...link,
    key: `nav-link-${link.href}-${link.label}`,
  } as typeof link & { key: string; component: React.ComponentType }
})

const Nav = () => (
  <nav className="navigation">
    <ul>
      {links.map(({ key, href, label, component: Component }) => (
        <li key={key}>
          {<Link id={'nav-' + label.toLowerCase()} href={href}>{Component ? <Component /> : label}</Link>}
        </li>
      ))}
    </ul>
  </nav>
)

export default Nav
