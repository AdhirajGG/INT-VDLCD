// components/navbar.tsx
import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "@/components/mobile-sidebar";
import { colors } from "@/lib/colors";

const Navbar = () => {
    return ( 
        <div className="flex items-center p-4"
        style={{ background: colors.background.dark }}
        >
            <MobileSidebar/>
            <div className="flex w-full justify-end ">
                <UserButton/>
            </div>
        </div>
     );
}
 
export default Navbar;