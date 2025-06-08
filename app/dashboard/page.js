"use client"

import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { savepassword } from '@/actions/route'
import { findpasswords } from '@/actions/route'
import { handleEdit } from '@/actions/route'
import { deletepassword } from '@/actions/route'
import { ToastContainer, toast } from 'react-toastify';
import { useUser } from '@clerk/nextjs'
import Loader from '@/components/Loader'

const Manager = () => {

    const { user, isLoaded } = useUser();
    const [loading, setloading] = useState(true)
    const [email, setEmail] = useState("");
    const [form, setform] = useState({ id: null, site: "", username: "", password: "", email: email })
    const [passwords, setpasswords] = useState([])
    const formref = useRef()
    const reye = useRef()
    const [showPassword, setshowPassword] = useState(false)

    const hideonemenu = (id) => {
        document.getElementById(`mobile-menu-${id}`).classList.add('hidden');
    }

    const hideallmenus = (id) => {
        document.querySelectorAll('.mobile-menu').forEach(menu => {
            if (menu.id !== `mobile-menu-${id}`) {
                menu.classList.add('hidden');
            }
        });
    }

    const handleedit = (id) => {
        const target = passwords.find(i => i.id === id)
        setform({ ...target, id })
        setpasswords(passwords.filter(i => i.id != id))
    }


    async function data(email) {
        let data = await findpasswords(email)
        setpasswords(data)
    }

    const handledel = (e) => {
        async function main() {
            const notify = () => toast.success("Successfully password has deleted");
            let c = confirm("Are you sure do you want to delete it")
            if (c) {
                await deletepassword(e)
                notify()
                data(email)
            }
        }
        main()
    }

    const handlechange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }


    const handlesave = async () => {
        if (form.username.length > 3 && form.site.length > 3 && form.password.length > 3) {
            const notify = () => toast.success("Successfully password has saved");
            if (form.id) {
                // It's an edit
                await handleEdit(form.id, form);
                notify()
            } else {
                // It's a new save
                await savepassword(form);
                notify()
            }
            formref.current.reset();
            setform({ id: null, site: "", username: "", password: "", email: email }) // reset form
            data(email); // reload passwords
        }
    }

    const handlecopy = (text) => {
        if (!navigator.clipboard) {
            // Fallback for browsers without Clipboard API
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            toast.success("Text copied Successfully");
            return;
        }

        navigator.clipboard.writeText(text)
            .then(() => toast.success("Text copied!"))
            .catch((err) => toast.error("Failed to copy: " + err));
    };

    const handlepass = () => {
        if (showPassword == false) {
            setshowPassword(true)
        } else {
            setshowPassword(false)
        }
    }

    useEffect(() => {
        if (isLoaded && user) {
            const primaryEmail = user.emailAddresses[0].emailAddress;
            setEmail(primaryEmail);
            setform({ id: null, site: "", username: "", password: "", email: email })
            data(email)
            setTimeout(() => {
                setloading(false)
            }, 2000);
        }
    }, [isLoaded, user, email]);

    return (
        <>
            <ToastContainer />
            <Head>
                <title>Password Manager | PassOP</title>
                <meta name="description" content="Securely save and manage your passwords using PassOP – a privacy-first password manager." />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <main className='container mx-auto md:w-[70%]'>

                <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]">

                </div>
                </div>

                <div className=" p-3 min-h-[80.7vh] w-full text-center">
                    <h1 className='text-4xl text font-bold '>
                        <span className='text-green-500'> &lt;</span>
                        <span>Pass</span><span className='text-green-500'>OP/&gt;</span>
                    </h1>
                    <div>Your own Password Manager</div>
                    <section>
                        <form ref={formref}>

                            <input type="text" name='site' value={form.site} placeholder='Enter site URL' className='rounded-full border border-green-500 w-full p-4 py-1 my-4' onChange={handlechange} />
                            <div className='flex flex-col gap-4 md:flex-row'>
                                <input type="text" value={form.username} placeholder='Enter Username' name='username' className='rounded-full border border-green-500 w-full p-4 py-1' onChange={handlechange} />
                                <div className='h-max w-full md:w-max relative'>
                                    <input value={form.password} placeholder='Enter password' type={showPassword ? "text" : "password"} name='password' className='rounded-full border border-green-500 w-full p-4 py-1' onChange={handlechange} />
                                    <Image src={showPassword ? '/ceye.svg' : '/eye.svg'} className='absolute invert top-1.5 right-1 cursor-pointer' width={25} height={25} alt='eye' onClick={handlepass} />
                                </div>
                            </div>
                        </form>
                    </section>
                    <button disabled={!isLoaded} className="disabled:bg-green-400 flex items-center gap-1.5 bg-green-500 w-max py-1 px-2 rounded-full mx-auto mt-5 cursor-pointer" onClick={handlesave}>
                        <Image src={'/add.svg'} width={35} height={35} alt="add" />
                        <div className="font-bold text-white">Save</div>
                    </button>
                    {passwords.length == 0 && !loading && <div className='mt-5 font-bold'>No Paswords to show</div>}
                    {loading && <div className="flex items-center justify-center">
                        <Loader />
                    </div>}
                    {passwords.length > 0 && (
                        <div className="hidden md:block mt-6 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-green-600">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Site
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Username
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Password
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                {/* <span className="sr-only">Actions</span> */}
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {passwords.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <a
                                                            href={item.site.startsWith('http') ? item.site : `https://${item.site}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                                        >
                                                            {item.site.replace(/^https?:\/\//, '').split('/')[0]}
                                                        </a>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-mono">{item.username}</span>
                                                        <button
                                                            onClick={() => handlecopy(item.username)}
                                                            aria-label="Copy username"
                                                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                                                        >
                                                            <Image
                                                                src="/copy.svg"
                                                                alt=""
                                                                width={16}
                                                                height={16}
                                                                className="opacity-70 hover:opacity-100 invert"
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-mono tracking-wider">
                                                            {item.password.replace(/./g, '•')}
                                                        </span>
                                                        <button
                                                            onClick={() => handlecopy(item.password)}
                                                            aria-label="Copy password"
                                                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                                                        >
                                                            <Image
                                                                src="/copy.svg"
                                                                alt=""
                                                                width={16}
                                                                height={16}
                                                                className="opacity-70 hover:opacity-100 invert"
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-4">
                                                        <button
                                                            onClick={() => handleedit(item.id)}
                                                            aria-label="Edit password"
                                                            className="text-gray-500 hover:text-green-600 transition-colors"
                                                        >
                                                            <Image
                                                                src="/edit.svg"
                                                                alt=""
                                                                width={18}
                                                                height={18}
                                                                className='invert'
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() => handledel(item.id)}
                                                            aria-label="Delete password"
                                                            className="text-gray-500 hover:text-red-600 transition-colors"
                                                        >
                                                            <Image
                                                                src="/del.svg"
                                                                alt=""
                                                                width={18}
                                                                height={18}
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {passwords.length > 0 && (
                        <div className="block md:hidden w-full mt-4 space-y-4">
                            {passwords.map((item) => (
                                <div key={item.id} className="w-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 relative">
                                    {/* Three dots menu button and dropdown */}
                                    <div className='bg-green-600 flex justify-end mb-[1px]'>
                                        <div>
                                            <button
                                                onClick={() => {
                                                    // Close all other menus first
                                                    hideallmenus(item.id)
                                                    // Toggle current menu
                                                    document.getElementById(`mobile-menu-${item.id}`).classList.toggle('hidden');
                                                }}
                                                className="p-2 rounded-full hover:bg-green-400 focus:outline-none overflow-hidden"
                                                aria-label="Actions"
                                            >
                                                <Image src={'menu.svg'} width={23} height={20} alt='edit'/>
                                            </button>

                                        </div>
                                        {/* Dropdown menu */}
                                        <div
                                            id={`mobile-menu-${item.id}`}
                                            className="mobile-menu hidden absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                        >
                                            <div className="py-1">
                                                <button
                                                    onClick={() => {
                                                        handleedit(item.id);
                                                        hideonemenu(item.id)
                                                    }}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                >
                                                    <Image
                                                        src="/edit.svg"
                                                        alt="Edit"
                                                        width={16}
                                                        height={16}
                                                        className="mr-2 invert"
                                                    />
                                                    Edit
                                                </button>
                                                <button

                                                    onClick={() => {
                                                        handledel(item.id);
                                                        hideonemenu(item.id)
                                                    }}
                                                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                                >
                                                    <Image
                                                        src="/del.svg"
                                                        alt="Delete"
                                                        width={16}
                                                        height={16}
                                                        className="mr-2"
                                                    />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password item content */}
                                    <div className="divide-y divide-gray-200">
                                        {/* Site Row */}
                                        <div className="flex">
                                            <div className="w-1/3 bg-green-600 p-3 text-white font-medium">
                                                Site
                                            </div>
                                            <div className="w-2/3 p-3 bg-green-50">
                                                <a
                                                    href={item.site.startsWith('http') ? item.site : `https://${item.site}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline break-all"
                                                >
                                                    {item.site.replace(/^https?:\/\//, '').split('/')[0]}
                                                </a>
                                            </div>
                                        </div>

                                        {/* Username Row */}
                                        <div className="flex">
                                            <div className="w-1/3 bg-green-600 p-3 text-white font-medium">
                                                Username
                                            </div>
                                            <div className="w-2/3 p-3 bg-green-50 flex items-center justify-between">
                                                <span className="font-mono break-all w-[70%]">{item.username}</span>
                                                <button
                                                    onClick={() => handlecopy(item.username)}
                                                    aria-label="Copy username"
                                                    className="ml-2 p-1 rounded hover:bg-gray-200 w-[30%]"
                                                >
                                                    <Image
                                                        src="/copy.svg"
                                                        alt="Copy"
                                                        width={16}
                                                        height={16}
                                                        className="opacity-70 hover:opacity-100 invert"
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Password Row */}
                                        <div className="flex">
                                            <div className="w-1/3 bg-green-600 p-3 text-white font-medium">
                                                Password
                                            </div>
                                            <div className="w-2/3 p-3 bg-green-50 flex items-center justify-between">
                                                <span className="font-mono tracking-wider break-all">
                                                    {item.password.replace(/./g, '•')}
                                                </span>
                                                <button
                                                    onClick={() => handlecopy(item.password)}
                                                    aria-label="Copy password"
                                                    className="ml-2 p-1 rounded hover:bg-gray-200"
                                                >
                                                    <Image
                                                        src="/copy.svg"
                                                        alt="Copy"
                                                        width={16}
                                                        height={16}
                                                        className="opacity-70 hover:opacity-100 invert"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}

export default Manager

















































































































































































































































































































































// "use client"

// import Head from 'next/head';
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Image from 'next/image';
// import { savepassword, findpasswords, handleEdit, deletepassword } from '@/actions/route';
// import { ToastContainer, toast } from 'react-toastify';
// import { useUser } from '@clerk/nextjs';
// import Loader from '@/components/Loader';

// const PasswordManager = () => {
//     const { user, isLoaded } = useUser();
//     const [loading, setLoading] = useState(true);
//     const [email, setEmail] = useState("");
//     const [form, setForm] = useState({ 
//         id: null, 
//         site: "", 
//         username: "", 
//         password: "", 
//         email: email 
//     });
//     const [passwords, setPasswords] = useState([]);
//     const [showPassword, setShowPassword] = useState(false);
//     const formRef = useRef();
    
//     // SEO Metadata
//     const pageTitle = "Password Manager | PassOP";
//     const pageDescription = "Securely save and manage your passwords using PassOP – a privacy-first password manager.";
    
//     // Toggle password visibility
//     const togglePasswordVisibility = () => setShowPassword(prev => !prev);
    
//     // Hide mobile menu for a specific item
//     const hideMobileMenu = (id) => {
//         const menu = document.getElementById(`mobile-menu-${id}`);
//         if (menu) menu.classList.add('hidden');
//     };
    
//     // Hide all mobile menus except the specified one
//     const hideAllMenusExcept = (id) => {
//         document.querySelectorAll('.mobile-menu').forEach(menu => {
//             if (menu.id !== `mobile-menu-${id}`) {
//                 menu.classList.add('hidden');
//             }
//         });
//     };
    
//     // Handle edit action
//     const handleEditClick = (id) => {
//         const target = passwords.find(item => item.id === id);
//         if (target) {
//             setForm({ ...target, id });
//             setPasswords(passwords.filter(item => item.id !== id));
//         }
//     };
    
//     // Fetch passwords data
//     const fetchPasswords = useCallback(async (email) => {
//         const data = await findpasswords(email);
//         setPasswords(data);
//     }, []);
    
//     // Handle delete action
//     const handleDelete = async (id) => {
//         const confirmDelete = confirm("Are you sure you want to delete this password?");
//         if (confirmDelete) {
//             try {
//                 await deletepassword(id);
//                 toast.success("Password successfully deleted");
//                 fetchPasswords(email);
//             } catch (error) {
//                 toast.error("Failed to delete password");
//             }
//         }
//     };
    
//     // Handle form field changes
//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };
    
//     // Save or update password
//     const handleSave = async () => {
//         if (form.username.length > 3 && form.site.length > 3 && form.password.length > 3) {
//             try {
//                 if (form.id) {
//                     await handleEdit(form.id, form);
//                 } else {
//                     await savepassword(form);
//                 }
//                 toast.success("Password successfully saved");
//                 formRef.current?.reset();
//                 setForm({ id: null, site: "", username: "", password: "", email });
//                 fetchPasswords(email);
//             } catch (error) {
//                 toast.error("Failed to save password");
//             }
//         }
//     };
    
//     // Copy text to clipboard
//     const handleCopy = (text) => {
//         navigator.clipboard.writeText(text)
//             .then(() => toast.success("Copied to clipboard!"))
//             .catch(() => {
//                 // Fallback for older browsers
//                 const textarea = document.createElement('textarea');
//                 textarea.value = text;
//                 document.body.appendChild(textarea);
//                 textarea.select();
//                 document.execCommand('copy');
//                 document.body.removeChild(textarea);
//                 toast.success("Copied to clipboard!");
//             });
//     };
    
//     // Initialize component
//     useEffect(() => {
//         if (isLoaded && user) {
//             const primaryEmail = user.emailAddresses[0]?.emailAddress || "";
//             setEmail(primaryEmail);
//             setForm(prev => ({ ...prev, email: primaryEmail }));
//             fetchPasswords(primaryEmail);
            
//             const timer = setTimeout(() => {
//                 setLoading(false);
//             }, 2000);
            
//             return () => clearTimeout(timer);
//         }
//     }, [isLoaded, user, fetchPasswords]);

//     return (
//         <>
//             <ToastContainer position="top-right" autoClose={3000} />
//             <Head>
//                 <title>{pageTitle}</title>
//                 <meta name="description" content={pageDescription} />
//                 <meta name="keywords" content="password manager, secure passwords, password storage, online security" />
//                 <meta name="robots" content="index, follow" />
//                 <meta name="viewport" content="width=device-width, initial-scale=1" />
//                 <meta property="og:title" content={pageTitle} />
//                 <meta property="og:description" content={pageDescription} />
//                 <meta property="og:type" content="website" />
//                 <link rel="canonical" href="https://yourdomain.com/manager" />
//             </Head>

//             <main className="container mx-auto md:w-[70%]">
//                 <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
//                     <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
//                 </div>

//                 <div className="p-3 min-h-[80.7vh] w-full text-center">
//                     <h1 className="text-4xl font-bold">
//                         <span className="text-green-500">&lt;</span>
//                         <span>Pass</span>
//                         <span className="text-green-500">OP/&gt;</span>
//                     </h1>
//                     <p className="text-gray-600">Your own secure password manager</p>
                    
//                     {/* Password Form Section */}
//                     <section className="mt-6">
//                         <form ref={formRef} aria-label="Password entry form">
//                             <input
//                                 type="text"
//                                 name="site"
//                                 value={form.site}
//                                 placeholder="Enter website URL"
//                                 className="rounded-full border border-green-500 w-full p-4 py-1 my-4"
//                                 onChange={handleChange}
//                                 aria-label="Website URL"
//                                 required
//                                 minLength={4}
//                             />
                            
//                             <div className="flex flex-col gap-4 md:flex-row">
//                                 <input
//                                     type="text"
//                                     value={form.username}
//                                     placeholder="Enter username"
//                                     name="username"
//                                     className="rounded-full border border-green-500 w-full p-4 py-1"
//                                     onChange={handleChange}
//                                     aria-label="Username"
//                                     required
//                                     minLength={4}
//                                 />
                                
//                                 <div className="h-max w-full md:w-max relative">
//                                     <input
//                                         value={form.password}
//                                         placeholder="Enter password"
//                                         type={showPassword ? "text" : "password"}
//                                         name="password"
//                                         className="rounded-full border border-green-500 w-full p-4 py-1"
//                                         onChange={handleChange}
//                                         aria-label="Password"
//                                         required
//                                         minLength={4}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={togglePasswordVisibility}
//                                         className="absolute top-1.5 right-1 cursor-pointer"
//                                         aria-label={showPassword ? "Hide password" : "Show password"}
//                                     >
//                                         <Image
//                                             src={showPassword ? '/ceye.svg' : '/eye.svg'}
//                                             width={25}
//                                             height={25}
//                                             alt="Toggle password visibility"
//                                             className="invert"
//                                         />
//                                     </button>
//                                 </div>
//                             </div>
//                         </form>
//                     </section>
                    
//                     {/* Save Button */}
//                     <button
//                         disabled={!isLoaded}
//                         className="disabled:bg-green-400 flex items-center gap-1.5 bg-green-500 w-max py-1 px-2 rounded-full mx-auto mt-5 cursor-pointer hover:bg-green-600 transition-colors"
//                         onClick={handleSave}
//                         aria-label="Save password"
//                     >
//                         <Image src="/add.svg" width={35} height={35} alt="Add" />
//                         <span className="font-bold text-white">Save</span>
//                     </button>
                    
//                     {/* Loading State */}
//                     {loading && (
//                         <div className="flex items-center justify-center mt-8">
//                             <Loader />
//                         </div>
//                     )}
                    
//                     {/* Empty State */}
//                     {!loading && passwords.length === 0 && (
//                         <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
//                             <p className="font-medium text-gray-600">No passwords saved yet</p>
//                             <p className="text-sm text-gray-500 mt-1">Add your first password using the form above</p>
//                         </div>
//                     )}
                    
//                     {/* Desktop Table View */}
//                     {passwords.length > 0 && (
//                         <div className="hidden md:block mt-8 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-green-600">
//                                         <tr>
//                                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                                 Website
//                                             </th>
//                                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                                 Username
//                                             </th>
//                                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                                 Password
//                                             </th>
//                                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                                 Actions
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {passwords.map((item) => (
//                                             <tr key={item.id} className="hover:bg-gray-50">
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center">
//                                                         <a
//                                                             href={item.site.startsWith('http') ? item.site : `https://${item.site}`}
//                                                             target="_blank"
//                                                             rel="noopener noreferrer"
//                                                             className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
//                                                         >
//                                                             {item.site.replace(/^https?:\/\//, '').split('/')[0]}
//                                                         </a>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center space-x-2">
//                                                         <span className="font-mono">{item.username}</span>
//                                                         <button
//                                                             onClick={() => handleCopy(item.username)}
//                                                             aria-label="Copy username"
//                                                             className="p-1 rounded hover:bg-gray-100 transition-colors"
//                                                         >
//                                                             <Image
//                                                                 src="/copy.svg"
//                                                                 alt="Copy username"
//                                                                 width={16}
//                                                                 height={16}
//                                                                 className="opacity-70 hover:opacity-100 invert"
//                                                             />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center space-x-2">
//                                                         <span className="font-mono tracking-wider">
//                                                             {showPassword ? item.password : item.password.replace(/./g, '•')}
//                                                         </span>
//                                                         <button
//                                                             onClick={() => handleCopy(item.password)}
//                                                             aria-label="Copy password"
//                                                             className="p-1 rounded hover:bg-gray-100 transition-colors"
//                                                         >
//                                                             <Image
//                                                                 src="/copy.svg"
//                                                                 alt="Copy password"
//                                                                 width={16}
//                                                                 height={16}
//                                                                 className="opacity-70 hover:opacity-100 invert"
//                                                             />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                                     <div className="flex items-center justify-end space-x-4">
//                                                         <button
//                                                             onClick={() => handleEditClick(item.id)}
//                                                             aria-label="Edit password"
//                                                             className="text-gray-500 hover:text-green-600 transition-colors"
//                                                         >
//                                                             <Image
//                                                                 src="/edit.svg"
//                                                                 alt="Edit"
//                                                                 width={18}
//                                                                 height={18}
//                                                                 className="invert"
//                                                             />
//                                                         </button>
//                                                         <button
//                                                             onClick={() => handleDelete(item.id)}
//                                                             aria-label="Delete password"
//                                                             className="text-gray-500 hover:text-red-600 transition-colors"
//                                                         >
//                                                             <Image
//                                                                 src="/del.svg"
//                                                                 alt="Delete"
//                                                                 width={18}
//                                                                 height={18}
//                                                             />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}
                    
//                     {/* Mobile Card View */}
//                     {passwords.length > 0 && (
//                         <div className="block md:hidden w-full mt-6 space-y-4">
//                             {passwords.map((item) => (
//                                 <div key={item.id} className="w-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 relative">
//                                     {/* Mobile menu button and dropdown */}
//                                     <div className="bg-green-600 flex justify-end mb-[1px]">
//                                         <div>
//                                             <button
//                                                 // onBlur={() => hideMobileMenu(item.id)}
//                                                 onClick={() => {
//                                                     hideAllMenusExcept(item.id);
//                                                     const menu = document.getElementById(`mobile-menu-${item.id}`);
//                                                     if (menu) menu.classList.toggle('hidden');
//                                                 }}
//                                                 className="p-2 rounded-full hover:bg-green-400 focus:outline-none"
//                                                 aria-label="Password actions"
//                                             >
//                                                 <Image src="/menu.svg" width={23} height={20} alt="Menu" />
//                                             </button>
//                                         </div>
                                        
//                                         {/* Dropdown menu */}
//                                         <div
//                                             id={`mobile-menu-${item.id}`}
//                                             className="mobile-menu hidden absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200"
//                                         >
//                                             <div className="py-1">
//                                                 <button
//                                                     onClick={() => {
//                                                         handleEditClick(item.id);
//                                                         hideMobileMenu(item.id);
//                                                     }}
//                                                     className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                                                 >
//                                                     <Image
//                                                         src="/edit.svg"
//                                                         alt="Edit"
//                                                         width={16}
//                                                         height={16}
//                                                         className="mr-2 invert"
//                                                     />
//                                                     Edit
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         handleDelete(item.id);
//                                                         hideMobileMenu(item.id);
//                                                     }}
//                                                     className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
//                                                 >
//                                                     <Image
//                                                         src="/del.svg"
//                                                         alt="Delete"
//                                                         width={16}
//                                                         height={16}
//                                                         className="mr-2"
//                                                     />
//                                                     Delete
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Password item content */}
//                                     <div className="divide-y divide-gray-200">
//                                         {/* Website */}
//                                         <div className="flex">
//                                             <div className="w-1/3 bg-green-600 p-3 text-white font-medium">
//                                                 Website
//                                             </div>
//                                             <div className="w-2/3 p-3 bg-green-50">
//                                                 <a
//                                                     href={item.site.startsWith('http') ? item.site : `https://${item.site}`}
//                                                     target="_blank"
//                                                     rel="noopener noreferrer"
//                                                     className="text-blue-600 hover:underline break-all"
//                                                 >
//                                                     {item.site.replace(/^https?:\/\//, '').split('/')[0]}
//                                                 </a>
//                                             </div>
//                                         </div>

//                                         {/* Username */}
//                                         <div className="flex">
//                                             <div className="w-1/3 bg-green-600 p-3 text-white font-medium">
//                                                 Username
//                                             </div>
//                                             <div className="w-2/3 p-3 bg-green-50 flex items-center justify-between">
//                                                 <span className="font-mono break-all w-[70%]">{item.username}</span>
//                                                 <button
//                                                     onClick={() => handleCopy(item.username)}
//                                                     aria-label="Copy username"
//                                                     className="ml-2 p-1 rounded hover:bg-gray-200 w-[30%]"
//                                                 >
//                                                     <Image
//                                                         src="/copy.svg"
//                                                         alt="Copy username"
//                                                         width={16}
//                                                         height={16}
//                                                         className="opacity-70 hover:opacity-100 invert"
//                                                     />
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         {/* Password */}
//                                         <div className="flex">
//                                             <div className="w-1/3 bg-green-600 p-3 text-white font-medium">
//                                                 Password
//                                             </div>
//                                             <div className="w-2/3 p-3 bg-green-50 flex items-center justify-between">
//                                                 <span className="font-mono tracking-wider break-all">
//                                                     {showPassword ? item.password : item.password.replace(/./g, '•')}
//                                                 </span>
//                                                 <button
//                                                     onClick={() => handleCopy(item.password)}
//                                                     aria-label="Copy password"
//                                                     className="ml-2 p-1 rounded hover:bg-gray-200"
//                                                 >
//                                                     <Image
//                                                         src="/copy.svg"
//                                                         alt="Copy password"
//                                                         width={16}
//                                                         height={16}
//                                                         className="opacity-70 hover:opacity-100 invert"
//                                                     />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </main>
//         </>
//     );
// };

// export default PasswordManager;
