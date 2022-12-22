//Nav
import Link from 'next/link'
export default function Nav() {
  return (
    <>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/projects">Projects</Link></li>
        <li><Link href="/playground">Playground</Link></li>
        <li><Link href="/ideas">Ideas</Link></li>
        <li><Link href="/companies">My Companies</Link></li>
      </ul>
    </>
  )
}
