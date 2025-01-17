import React from 'react'
import { Projects } from '../projects'
import { useEffect, useState } from 'react';
import { XCircleIcon } from "@heroicons/react/24/solid";
import { Zoom } from 'react-reveal';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import { Autocomplete, MenuItem } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import axios from 'axios';
import { NotificationManager } from "react-notifications";




export default function AllProjects({ data, fetchProjects, viewMode }) {
    const { user } = useSelector((state) => state.users);
    const [projects, setProjects] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [pms, setPms] = useState([]);
    const [selectedDevelopers, setSelectedDevelopers] = useState([]);
    const [selectedPms, setSelectedPms] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [avatarFile, setAvatarFile] = useState("./images/commune.gif");

    const [openNewModal, setOpenNewModal] = useState(false);

    useEffect(() => {
        const fetchDevelopers = async () => {
            try {
                const { data: { users } } = await axios.get(process.env.REACT_APP_API_BASE_URL + "/users/devs")
                setDevelopers(users);
            } catch (e) {
                NotificationManager.error('Error fetching Developers', 'Error')

            }
        }
        const fetchPms = async () => {
            try {
                const { data: { users } } = await axios.get(process.env.REACT_APP_API_BASE_URL + "/users/pms")
                setPms(users);
            } catch (e) {
                NotificationManager.error('Error fetching Pms', 'Error')
            }
        }

        fetchDevelopers();
        fetchPms();
    }, [])
    useEffect(() => {
        setProjects(data);
    }, [data])


    const handleNew = () => setOpenNewModal(true);

    const handleNewCancel = () => {
        setOpenNewModal(false);
    };

    const [openNewIdeaModal, setOpenNewIdeaModal] = useState(false);
    const handleNewIdea = () => setOpenNewIdeaModal(true);

    const handleNewIdeaCancel = () => {
        setOpenNewIdeaModal(false);
    };

    const handleAvatarFile = (e) => {
        setAvatarFile(URL.createObjectURL(e.target.files[0]));
    };

    const createProject = async (idea) => {
        if (title === '') {
            NotificationManager.error('Input project title', 'Error')
            return;
        }
        if (description === '') {
            NotificationManager.error('Input project description', 'Error')
            return;
        }
        const selectedDevs = [];
        selectedDevelopers.forEach((a) => {
            selectedDevs.push(a?._id);
        })
        const selectedManagers = [];
        selectedPms.forEach((a) => {
            selectedManagers.push(a?._id);
        })
        const project = { title, description, status: idea ? 'Idea' : 'To do', developers: selectedDevs, pms: selectedManagers };
        try {
            await axios.post(process.env.REACT_APP_API_BASE_URL + "/project/new", project)
            NotificationManager.success(idea ? 'New Idea suggested' : 'New project created', 'Success')
            fetchProjects();
            setOpenNewModal(false);
        } catch (e) {
            NotificationManager.error(idea ? 'Error suggesting new idea' : 'Error creating a project', 'Error')
        }
        setOpenNewIdeaModal(false);
    }

    return (
        <div className='w-full flex flex-col gap-[30px] justify-center mt-[50px] mb-[50px]'>
            <div className='px-[30px] w-full flex justify-end mr-[320px]'>

            </div>
            <div className='px-[30px] w-full flex justify-between mr-[320px]'>
                {projects.length > 0 && <div className='text-[20px] text-[#909090]'>
                    {`${projects.length}projects`}
                </div>}
                {(!user?.role.some((aRole) => aRole === 'Administrator') && !viewMode) && <button
                    className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-[12px] px-6 rounded-lg bg-gray-900 dark:bg-[rgb(36,36,36)] text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                    type="button"
                    data-ripple-light="true"
                    style={{ fontFamily: "Smack" }}
                    onClick={handleNewIdea}
                >
                    New Idea</button>
                }
                {user?.role.some((aRole) => aRole === 'Administrator') && <button
                    className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-[12px] px-6 rounded-lg bg-gray-900 dark:bg-[rgb(36,36,36)] text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                    type="button"
                    data-ripple-light="true"
                    style={{ fontFamily: "Smack" }}
                    onClick={handleNew}
                >
                    New Project</button>}
            </div>
            <div className=' flex flex-wrap justify-start gap-[10px]'>
                {
                    projects.length === 0 ? <div className='w-full flex items-center justify-center text-center text-[20px] text-[#909090]'>
                        <svg style={{ marginTop: '3px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <div className='ml-[10px]'> No projects</div>
                    </div> :
                        projects?.map((aProject) => (
                            <Projects {...aProject} fetchProjects={fetchProjects} />
                        ))}
            </div>
            {openNewModal ?
                <div className='fixed top-[0px] left-0 w-screen h-screen flex justify-center items-center z-[99]'>
                    <div className=' fixed w-screen h-screen top-0 left-0 bg-[#000] dark:bg-gray-500 opacity-40'>
                    </div>
                    <Zoom duration={500}>
                        <div className='fixed w-[1000px] rounded-[30px] h-auto flex justify-start items-center top-[30px] z-[111] bg-[#eee] dark:bg-[rgb(36,36,36)] shadow-md'>

                            <div className='flex justify-center items-start w-[100%] overflow-y-visible flex-col px-[10px] sm:px-[100px]' style={{ fontFamily: 'Smack' }}>
                                {/* <div className=' flex justify-center items-center  md:justify-start md:items-start text-[rgb(18,18,18)] w-full dark:text-white text-[30px] mt-[30px] lg:mt-[-30px]'>Profile details</div> */}
                                <div className=' fixed top-[30px] right-[30px] cursor-pointer z-[99]' onClick={handleNewCancel}>
                                    <XCircleIcon class="h-10 w-10 text-gray-800 dark:text-white" />
                                </div>
                                <div className='flex justify-center items-center w-full'>
                                    <div className='flex justify-center items-center w-full'>
                                        <div className=' mt-[20px] w-full flex justify-center items-center'>
                                            <div className='justify-center flex group items-center h-[10rem] w-[10rem] overflow-y-hidden bg-[#e1e1e1] hover:bg-[#cbcbcb] transition-all dark:bg-[rgb(30,30,30)] dark:hover:bg-[rgb(33,33,33)] cursor-pointer dark:border-[rgb(18,18,18)] border-[#ffffff] border-[5px] rounded-[50%]'>
                                                {avatarFile ?
                                                    <span className='w-full h-full flex overflow-y-hidden'>
                                                        <img className='w-full' src={avatarFile} alt="" />
                                                        {/* <img className='w-full' src='./images/12.png' alt="" /> */}
                                                    </span>
                                                    : <span className='w-full h-full'>
                                                        {/* <img className=' w-full h-full' src='' alt="" /> */}
                                                        <div className=' w-full h-full'>
                                                        </div>
                                                    </span>
                                                }
                                            </div>
                                            <div className='justify-center absolute bg-none flex group items-center h-[10rem] w-[10rem] overflow-y-hidden transition-all cursor-pointer rounded-[50%]'>
                                                <span className='profile_banner_edit_but opacity-[0.0001] w-fit m-auto flex justify-center items-center group-hover:opacity-100 transition-all lg:mt-[-100px] md:mt-[-70px] mt-[-50px] absolute'>
                                                    <svg className="h-5 w-5 text-[#ffffff] sm:h-8 sm:w-8" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M12 20h9" />  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                                </span>
                                                <input type="file" onChange={handleAvatarFile} className="opacity-0 w-full h-full cursor-pointer border rounded-[50%]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='justify-center items-center mt-[50px] w-full md:gap-[100px] gap-[50px] lg:flex-row flex-col'>
                                    <div className='w-full items-start flex-col'>
                                        <TextField
                                            sx={{
                                                // Root class for the input field
                                                "& .MuiOutlinedInput-root": {
                                                    color: "#5298e9",
                                                    fontFamily: "Arial",
                                                    // Class for the border around the input field
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: "#5298e9",
                                                        borderWidth: "1px",
                                                    },
                                                },
                                                // Class for the label of the input field
                                                "& .MuiInputLabel-outlined": {
                                                    color: "#5298e9",
                                                    fontWeight: "bold",
                                                },
                                            }}
                                            onChange={({ target: { value } }) => setTitle(value)}
                                            className='w-full' id="outlined-basic" label="Title" variant="outlined" />
                                    </div>
                                    <div className='w-full items-start flex-col mt-[40px]'>
                                        <TextField
                                            sx={{
                                                // Root class for the input field
                                                "& .MuiOutlinedInput-root": {
                                                    color: "#5298e9",
                                                    fontFamily: "Arial",
                                                    // Class for the border around the input field
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: "#5298e9",
                                                        borderWidth: "1px",
                                                    },
                                                },
                                                // Class for the label of the input field
                                                "& .MuiInputLabel-outlined": {
                                                    color: "#5298e9",
                                                    fontWeight: "bold",
                                                },
                                            }}
                                            onChange={({ target: { value } }) => setDescription(value)}

                                            className='w-full'
                                            id="outlined-multiline-flexible"
                                            label="Description"
                                            multiline
                                            rows={5}
                                        />
                                    </div>
                                    <div className='w-full items-start flex-col mt-[40px]'>
                                        <Autocomplete
                                            onChange={(e, values) => {
                                                setSelectedDevelopers(values);
                                            }}
                                            className='w-full'
                                            multiple
                                            options={developers}
                                            getOptionLabel={(option) => {
                                                return option.discordName
                                            }}
                                            disableCloseOnSelect
                                            renderInput={(params) => {
                                                return (
                                                    <TextField

                                                        {...params}
                                                        sx={{
                                                            // Root class for the input field
                                                            "& .MuiOutlinedInput-root": {
                                                                color: "#5298e9",
                                                                fontFamily: "Arial",
                                                                // Class for the border around the input field
                                                                "& .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: "#5298e9",
                                                                    borderWidth: "1px",
                                                                },
                                                            },
                                                            // Class for the label of the input field
                                                            "& .MuiInputLabel-outlined": {
                                                                color: "#5298e9",
                                                                fontWeight: "bold",
                                                            },
                                                        }}
                                                        variant="outlined"
                                                        label="Developers"
                                                        placeholder="Select Developers"
                                                    />
                                                )
                                            }}
                                            renderOption={(props, option, { selected }) => {
                                                return (
                                                    <MenuItem
                                                        {...props}
                                                        key={option?._id}
                                                        value={option?._id}
                                                        sx={{ justifyContent: "space-between" }}
                                                    >
                                                        {option.discordName}
                                                        {selected ? <CheckIcon color="info" /> : null}
                                                    </MenuItem>
                                                )
                                            }}
                                        />
                                    </div>
                                    <div className='w-full items-start flex-col mt-[40px]'>
                                        <Autocomplete
                                            onChange={(e, values) => {
                                                setSelectedPms(values);
                                            }}
                                            className='w-full'
                                            multiple
                                            options={pms}
                                            getOptionLabel={(option) => {
                                                return option.discordName
                                            }}
                                            disableCloseOnSelect
                                            renderInput={(params) => {
                                                return (
                                                    <TextField

                                                        {...params}
                                                        sx={{
                                                            // Root class for the input field
                                                            "& .MuiOutlinedInput-root": {
                                                                color: "#5298e9",
                                                                fontFamily: "Arial",
                                                                // Class for the border around the input field
                                                                "& .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: "#5298e9",
                                                                    borderWidth: "1px",
                                                                },
                                                            },
                                                            // Class for the label of the input field
                                                            "& .MuiInputLabel-outlined": {
                                                                color: "#5298e9",
                                                                fontWeight: "bold",
                                                            },
                                                        }}
                                                        variant="outlined"
                                                        label="Project Managers"
                                                        placeholder="Select Project Managers"
                                                    />
                                                )
                                            }}
                                            renderOption={(props, option, { selected }) => {
                                                return (
                                                    <MenuItem
                                                        {...props}
                                                        key={option?._id}
                                                        value={option?._id}
                                                        sx={{ justifyContent: "space-between" }}
                                                    >
                                                        {option.discordName}
                                                        {selected ? <CheckIcon color="info" /> : null}
                                                    </MenuItem>
                                                )
                                            }}
                                        />
                                    </div>

                                </div>

                                <div className=' flex justify-center items-center w-full mt-[50px] mb-[40px]'>
                                    <div onClick={() => createProject(false)} style={{ fontFamily: 'Might', width: '200px', fontSize: '18px', transition: '0.1s' }} className="relative rounded-[15px]  cursor-pointer group font-medium no-underline flex p-2 text-white items-center justify-center content-center focus:outline-none">
                                        <span className="absolute top-0 left-0 w-full h-full rounded-[15px] opacity-50 filter blur-sm bg-gradient-to-br from-[#256fc4] to-[#256fc4]"  ></span>
                                        <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-[#256fc4] to-[#256fc4]"></span>
                                        <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-[#256fc4] to-[#256fc4]"></span>
                                        <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-[#256fc4] from-[#256fc4]"></span>
                                        <span className="relative">Create</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Zoom>
                </div>
                : <></>}
            {openNewIdeaModal ?
                <div className='fixed top-[0px] left-0 w-screen h-screen flex justify-center items-center z-[99]'>
                    <div className=' fixed w-screen h-screen top-0 left-0 bg-[#000] dark:bg-gray-500 opacity-40'>
                    </div>
                    <Zoom duration={500}>
                        <div className='fixed w-[1000px] rounded-[30px] h-auto flex justify-start items-center top-[30px] z-[111] bg-[#eee] dark:bg-[rgb(36,36,36)] shadow-md'>

                            <div className='flex justify-center items-start w-[100%] overflow-y-visible flex-col px-[10px] sm:px-[100px]' style={{ fontFamily: 'Smack' }}>
                                {/* <div className=' flex justify-center items-center  md:justify-start md:items-start text-[rgb(18,18,18)] w-full dark:text-white text-[30px] mt-[30px] lg:mt-[-30px]'>Profile details</div> */}
                                <div className=' fixed top-[30px] right-[30px] cursor-pointer z-[99]' onClick={handleNewIdeaCancel}>
                                    <XCircleIcon class="h-10 w-10 text-gray-800 dark:text-white" />
                                </div>
                                <div className='flex justify-center items-center w-full'>
                                    <div className='flex justify-center items-center w-full'>
                                        <div className=' mt-[20px] w-full flex justify-center items-center'>
                                            <div className='justify-center flex group items-center h-[10rem] w-[10rem] overflow-y-hidden bg-[#e1e1e1] hover:bg-[#cbcbcb] transition-all dark:bg-[rgb(30,30,30)] dark:hover:bg-[rgb(33,33,33)] cursor-pointer dark:border-[rgb(18,18,18)] border-[#ffffff] border-[5px] rounded-[50%]'>
                                                {avatarFile ?
                                                    <span className='w-full h-full flex overflow-y-hidden'>
                                                        <img className='w-full' src={avatarFile} alt="" />
                                                        {/* <img className='w-full' src='./images/12.png' alt="" /> */}
                                                    </span>
                                                    : <span className='w-full h-full'>
                                                        {/* <img className=' w-full h-full' src='' alt="" /> */}
                                                        <div className=' w-full h-full'>
                                                        </div>
                                                    </span>
                                                }
                                            </div>
                                            <div className='justify-center absolute bg-none flex group items-center h-[10rem] w-[10rem] overflow-y-hidden transition-all cursor-pointer rounded-[50%]'>
                                                <span className='profile_banner_edit_but opacity-[0.0001] w-fit m-auto flex justify-center items-center group-hover:opacity-100 transition-all lg:mt-[-100px] md:mt-[-70px] mt-[-50px] absolute'>
                                                    <svg className="h-5 w-5 text-[#ffffff] sm:h-8 sm:w-8" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M12 20h9" />  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                                </span>
                                                <input type="file" onChange={handleAvatarFile} className="opacity-0 w-full h-full cursor-pointer border rounded-[50%]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='justify-center items-center mt-[50px] w-full md:gap-[100px] gap-[50px] lg:flex-row flex-col'>
                                    <div className='w-full items-start flex-col'>
                                        <TextField
                                            sx={{
                                                // Root class for the input field
                                                "& .MuiOutlinedInput-root": {
                                                    color: "#5298e9",
                                                    fontFamily: "Arial",
                                                    // Class for the border around the input field
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: "#5298e9",
                                                        borderWidth: "1px",
                                                    },
                                                },
                                                // Class for the label of the input field
                                                "& .MuiInputLabel-outlined": {
                                                    color: "#5298e9",
                                                    fontWeight: "bold",
                                                },
                                            }}
                                            onChange={({ target: { value } }) => setTitle(value)}
                                            className='w-full' id="outlined-basic" label="Title" variant="outlined" />
                                    </div>
                                    <div className='w-full items-start flex-col mt-[40px]'>
                                        <TextField
                                            sx={{
                                                // Root class for the input field
                                                "& .MuiOutlinedInput-root": {
                                                    color: "#5298e9",
                                                    fontFamily: "Arial",
                                                    // Class for the border around the input field
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: "#5298e9",
                                                        borderWidth: "1px",
                                                    },
                                                },
                                                // Class for the label of the input field
                                                "& .MuiInputLabel-outlined": {
                                                    color: "#5298e9",
                                                    fontWeight: "bold",
                                                },
                                            }}
                                            onChange={({ target: { value } }) => setDescription(value)}

                                            className='w-full'
                                            id="outlined-multiline-flexible"
                                            label="Description"
                                            multiline
                                            rows={5}
                                        />
                                    </div>
                                    <div className='w-full items-start flex-col mt-[40px]'>
                                        <Autocomplete
                                            onChange={(e, values) => {
                                                setSelectedDevelopers(values);
                                            }}
                                            className='w-full'
                                            multiple
                                            options={developers}
                                            getOptionLabel={(option) => {
                                                return option.discordName
                                            }}
                                            disableCloseOnSelect
                                            renderInput={(params) => {
                                                return (
                                                    <TextField
                                                        sx={{
                                                            // Root class for the input field
                                                            "& .MuiOutlinedInput-root": {
                                                                color: "#5298e9",
                                                                fontFamily: "Arial",
                                                                // Class for the border around the input field
                                                                "& .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: "#5298e9",
                                                                    borderWidth: "1px",
                                                                },
                                                            },
                                                            // Class for the label of the input field
                                                            "& .MuiInputLabel-outlined": {
                                                                color: "#5298e9",
                                                                fontWeight: "bold",
                                                            },
                                                        }}
                                                        {...params}
                                                        variant="outlined"
                                                        label="Developers"
                                                        placeholder="Select Developers"
                                                    />
                                                )
                                            }}
                                            renderOption={(props, option, { selected }) => {
                                                return (
                                                    <MenuItem
                                                        {...props}
                                                        key={option?._id}
                                                        value={option?._id}
                                                        sx={{ justifyContent: "space-between" }}
                                                    >
                                                        {option.discordName}
                                                        {selected ? <CheckIcon color="info" /> : null}
                                                    </MenuItem>
                                                )
                                            }}
                                        />
                                    </div>
                                    <div className='w-full items-start flex-col mt-[40px]'>
                                        <Autocomplete
                                            onChange={(e, values) => {
                                                setSelectedPms(values);
                                            }}
                                            className='w-full'
                                            multiple
                                            options={pms}
                                            getOptionLabel={(option) => {
                                                return option.discordName
                                            }}
                                            disableCloseOnSelect
                                            renderInput={(params) => {
                                                return (
                                                    <TextField
                                                        sx={{
                                                            // Root class for the input field
                                                            "& .MuiOutlinedInput-root": {
                                                                color: "#5298e9",
                                                                fontFamily: "Arial",
                                                                // Class for the border around the input field
                                                                "& .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: "#5298e9",
                                                                    borderWidth: "1px",
                                                                },
                                                            },
                                                            // Class for the label of the input field
                                                            "& .MuiInputLabel-outlined": {
                                                                color: "#5298e9",
                                                                fontWeight: "bold",
                                                            },
                                                        }}
                                                        {...params}
                                                        variant="outlined"
                                                        label="Project Managers"
                                                        placeholder="Select Project Managers"
                                                    />
                                                )
                                            }}
                                            renderOption={(props, option, { selected }) => {
                                                return (
                                                    <MenuItem
                                                        {...props}
                                                        key={option?._id}
                                                        value={option?._id}
                                                        sx={{ justifyContent: "space-between" }}
                                                    >
                                                        {option.discordName}
                                                        {selected ? <CheckIcon color="info" /> : null}
                                                    </MenuItem>
                                                )
                                            }}
                                        />
                                    </div>

                                </div>

                                <div className=' flex justify-center items-center w-full mt-[50px] mb-[40px]'>
                                    <div onClick={() => createProject(true)} style={{ fontFamily: 'Might', width: '200px', fontSize: '18px', transition: '0.1s' }} className="relative rounded-[15px]  cursor-pointer group font-medium no-underline flex p-2 text-white items-center justify-center content-center focus:outline-none">
                                        <span className="absolute top-0 left-0 w-full h-full rounded-[15px] opacity-50 filter blur-sm bg-gradient-to-br from-[#256fc4] to-[#256fc4]"  ></span>
                                        <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-[#256fc4] to-[#256fc4]"></span>
                                        <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-[#256fc4] to-[#256fc4]"></span>
                                        <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-[#256fc4] from-[#256fc4]"></span>
                                        <span className="relative">Suggest New Idea</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Zoom>
                </div>
                : <></>}
        </div >
    )
}
