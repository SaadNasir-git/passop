import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Navbar = () => {
    return (
        <nav className='bg-slate-800 text-white '>
            <div className="mycontainer flex justify-between items-center px-4 py-5 h-14">
                <Link href={'/'}>
                    <div className="font-bold text-white text-2xl">
                        <span className='text-green-500'> &lt;</span>
                        <span>Pass</span><span className='text-green-500'>OP/&gt;</span>
                    </div>
                </Link>
                <button className='text-white bg-green-700 my-5 mx-2 rounded-full flex  justify-between items-center ring-white ring-1'>
                    <Image src={'/github.svg'} className='invert  w-10 p-1' width={35} height={35} alt='github'></Image>
                    <span className='font-bold px-2'>GitHub</span>
                </button>
            </div>
        </nav>
    )
}

export default Navbar
