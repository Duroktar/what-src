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

const Nav = React.memo(() => (
  <nav className="navigation">
    <ul>
      {links.map(item => (
        <li key={item.key}>
          {<NavItem {...item} />}
        </li>
      ))}
    </ul>
  </nav>
))

type PropTypes = { component: React.ComponentType, label: string, href: string }

const NavItem = React.memo(({ component: Component, label, href }: PropTypes) => (
  <Link id={'nav-' + label.toLowerCase()} href={href} aria-label={`link to ${label} page`}>
    {Component ? <Component /> : label}
  </Link>
))

export default Nav
