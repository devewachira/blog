import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import auth from "../assets/auth.jpg"

const Signup = () => {

    const navigate = useNavigate()
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(user)

        try {
            const response = await axios.post('/api/v1/user/register', user, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            if (response.data.success) {
                navigate('/login')
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            const msg = error?.response?.data?.message || error?.message || 'Request failed';
            toast.error(msg)
        }

        // try {
        //     dispatch(setLoading(true))
        //     const response = await axios.post("", user, {
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         withCredentials: true,
        //     });
        //     if (response.data.success) {
        //         navigate('/login')
        //         toast.success(response.data.message)
        //         // setFormData({ name: "", email: "", password: "", role: "" });
        //     } else {
        //         toast(`Error: ${data.message || "Something went wrong"}`);
        //     }
        // } catch (error) {
        //     // toast.error(error.response.data.message);
        //     console.log(error);

        // } finally {
        //     dispatch(setLoading(false))
        // }
    };

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen pt-16 grid md:grid-cols-2">
            {/* Left full-height image */}
            <div className='relative hidden md:block'>
                <img src={auth} alt="" className='absolute inset-0 w-full h-full object-cover' />
            </div>
            {/* Right form column */}
            <div className='flex justify-center items-center px-4 md:px-0 bg-transparent'>
                <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90">
                    <CardHeader>
                        <CardTitle>
                            <h1 className="text-center text-xl font-semibold">Create an account</h1>
                        </CardTitle>
                        <p className=' mt-2 text-sm font-serif text-center dark:text-gray-300'>Enter your details below to create your account</p>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className='flex gap-3'>
                                <div>
                                    <Label>First Name</Label>
                                    <Input type="text"
                                        placeholder="First Name"
                                        name="firstName"
                                        value={user.firstName}
                                        onChange={handleChange}
                                        className="dark:border-gray-600 dark:bg-gray-900"
                                    />
                                </div>

                                <div>
                                    <Label>Last Name</Label>
                                    <Input type="text"
                                        placeholder="Last Name"
                                        name="lastName"
                                        value={user.lastName}
                                        onChange={handleChange}
                                        className="dark:border-gray-600 dark:bg-gray-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input type="email"
                                    placeholder="john.doe@example.com"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    className="dark:border-gray-600 dark:bg-gray-900"
                                />
                            </div>

                            <div className="relative">
                                <Label>Password</Label>
                                <Input type={showPassword ? "text" : "password"}
                                    placeholder="Create a Password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    className="dark:border-gray-600 dark:bg-gray-900"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-9 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <Button type="submit" className="w-full">Sign Up</Button>
                            <p className='text-center text-gray-600 dark:text-gray-300'>Already have an account? <Link to={'/login'}><span className='underline cursor-pointer hover:text-gray-800 dark:hover:text-gray-100'>Sign in</span></Link></p>
                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

export default Signup

