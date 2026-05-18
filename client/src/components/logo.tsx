import { PROTECTED_ROUTES } from "@/routes/routes"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import logoImg from "@/assets/logo.png"

const Logo = ({ isCollapsed = false, className }: { isCollapsed?: boolean, className?: string }) => {
    return (
        <Link
            to={PROTECTED_ROUTES.HOME}
            className={cn("flex items-center gap-2 group transition-all shrink-0 select-none", className)}>
            <div className={cn(
                "flex items-center justify-center overflow-hidden rounded-xl bg-background transition-all duration-300",
                isCollapsed ? "w-10 h-10 p-1" : "w-10 h-10"
            )}>
                <img 
                    src={logoImg} 
                    alt="BrandForge Logo" 
                    className={cn(
                        "w-full h-full object-contain transition-transform duration-300 group-hover:scale-110",
                        isCollapsed ? "scale-125" : "scale-100"
                    )} 
                />
            </div>
            {!isCollapsed && (
                <span className={cn("text-xl font-bold tracking-tight text-foreground transition-all duration-300 opacity-100", className)}>
                    BrandForge
                </span>
            )}
        </Link>
    )
}

export default Logo