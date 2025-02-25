import { Outlet } from "react-router";

export function MainLayout() {
  console.log('aorisent')
  return (
    <div>Bar:width,
      <Outlet />
    </div>
  );
}
