import Sidebar from "../SideBar"
export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
   <div className="flex min-h-screen bg-surface-secondary">
    <Sidebar/>
    <main className="flex-1">{children}</main>
   </div>
  )
}