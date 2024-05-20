import { useState } from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/constants/navItems";
import { MenuIcon } from "lucide-react";

function MobileSidebar({ className }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
            <div className="pt-3 flex ">
                    <img
                        src="/static/images/godentist_logo.jpeg"
                        alt="GoDentist Logo"
                        className="h-auto w-auto"
                    />
                </div>
              <div className="space-y-1">
                <DashboardNav items={navItems} setOpen={setOpen} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default MobileSidebar;
