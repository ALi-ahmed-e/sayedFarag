import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { uplodaFile } from '../../store/dashboardSlice';
import { useRef } from 'react';

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const inp = useRef()
    const dispatch = useDispatch()
    const [uoption, setuoption] = useState(undefined)


    const handleUpload = async () => {
        try {
            if (file) {
                const formData = new FormData();
                formData.append('file', file);


                // setuploadingFile(true)

                // await axios.post(`/api/upload-file/upload-excel-cheat`, formData, { withCredentials: true })

                dispatch(uplodaFile({formData,type:uoption}))

                // setuploadDone('done')


                // setuploadingFile(false)
                setFile(null)
                inp.current.value = ''
            }

        } catch (error) {
            // setuploadingFile(false)
            // setuploadDone(error.message)
            console.log(error)
            setFile(null)
            inp.current.value = ''
        }

    };




    return (
        <div className=' flex items-center justify-center sm:flex-row flex-col bg-white p-2 rounded-lg dark:bg-slate-800'>

            <select onChange={e => setuoption(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 mx-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >

                <option value={''}>اختر نوع الملف</option>

                <option value={true}>
                    ادراج حصه\امتحان شامل
                </option>

                <option value={false}>ادراج طلاب جدد</option>

            </select>

            <div className=' min-w-[250px] flex items-center justify-center my-2'>

                {uoption ?<div>
                    {!file ? <label
                        htmlFor="xlsx"
                        className="flex cursor-pointer items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
                    >
                        <IoCloudUploadOutline className='w-5 h-5' />
                        <span>Import</span>
                    </label>
                        :
                        <button onClick={handleUpload} className="flex cursor-pointer items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-200 transition-colors duration-200 bg-green-600 border rounded-lg gap-x-2 sm:w-auto hover:bg-green-800    dark:border-gray-700">
                            <IoCloudUploadOutline className='w-5 h-5' />
                            <span>upload</span>
                        </button>}

                    <input
                        accept=".xls, .xlsx"
                        onChange={e => setFile(e.target.files[0])}
                        id='xlsx'  // Use 'id' instead of 'name' for associating with 'htmlFor'
                        name='xlsx'  // Use 'id' instead of 'name' for associating with 'htmlFor'
                        className='hidden'
                        type='file'
                        ref={inp}
                    />


                </div>:<div className=' dark:text-white font-extrabold'>اختر نوع الملف</div>}
            </div>

        </div>

    )
}

export default UploadFile