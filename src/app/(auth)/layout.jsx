import ThemeToggler from "@/components/ThemeToggler";

const AuthLayout = ( { children } ) => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow absolute bottom-10 right-4">
                <ThemeToggler />
            </div>
            <div className="flex justify-end">
                { children }
            </div>
        </div>
    )
}
export default AuthLayout;