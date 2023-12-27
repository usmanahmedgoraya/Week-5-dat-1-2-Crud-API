import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Header = () => {
    const [token, setToken] = useState();
    useEffect(() => {
        setToken(localStorage.getItem('token'))
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
    }
    return (
        <div>
            <header className="text-gray-400 bg-gray-900 body-font">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
                    <a className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                        <span className="ml-3 text-xl">Grocery App</span>
                    </a>
                    {
                        token ? <Link to={"/login"} className="inline-flex items-center bg-gray-800 border-0 py-2 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0" onClick={handleLogout}>
                            Logout
                        </Link> : <div className="space-x-2">
                            <Link to={"/login"} className="inline-flex items-center bg-gray-800 border-0 py-2 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0">
                                Login
                            </Link>
                            <Link to={"/sign-up"} className="inline-flex items-center bg-gray-800 border-0 py-2 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0">
                                Signup
                            </Link>
                        </div>
                    }
                </div>
            </header>
        </div>
    )
}

export default Header