import { Card, Dropdown } from "flowbite-react";
import projectImg from "../../assets/commune.gif"
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Zoom } from 'react-reveal';
import { XCircleIcon } from "@heroicons/react/24/solid";
import TextField from '@mui/material/TextField';
import { Autocomplete, MenuItem } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from "react-router-dom";
import Label from './components/label';
import UserAvatar from "./components/userAvatar";

export function Projects(project) {
    const { user } = useSelector((state) => state.users);
    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description);
    const [avatarFile, setAvatarFile] = useState("./images/commune.gif");
    const [devAvatarFile, setDevAvatarFile] = useState("./images/12.png");
    const [status, setStatus] = useState(project.status);
    const [selectedDevelopers, setSelectedDevelopers] = useState(project.developers);
    const [selectedPms, setSelectedPms] = useState(project.pms);
    const [developers, setDevelopers] = useState([]);
    const [pms, setPms] = useState([]);
    const [marked, setMarked] = useState(false);
    const [incompleted, setIncompleted] = useState(false);

    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setTitle(project.title)
        setDescription(project.description)
        setStatus(project.status);
    }, [project])


    useEffect(() => {
        const fetchDevelopers = async () => {
            try {
                const { data: { users } } = await axios.get(process.env.REACT_APP_API_BASE_URL + "/users/devs")
                setDevelopers(users);
            } catch (e) {

            }
        }
        const fetchPms = async () => {
            try {
                const { data: { users } } = await axios.get(process.env.REACT_APP_API_BASE_URL + "/users/pms")
                setPms(users);
            } catch (e) {
            }
        }
        fetchDevelopers();
        fetchPms();
    }, [])
    const handleDetail = () => {
        setOpenDetailModal(true);
    };
    const handleEdit = () => setOpenEditModal(true);
    const handleDelete = async () => {
        try {
            await axios.delete(process.env.REACT_APP_API_BASE_URL + "/project/" + project?._id)
            NotificationManager.success('Deleted a project', 'Success')
            project.fetchProjects();
        } catch (e) {
            NotificationManager.error('Error deleting a project', 'Error')
        }
    }

    const handleDetailCancel = () => {
        setOpenDetailModal(false);
    };

    const handleEditCancel = () => {
        setOpenEditModal(false);
    };


    const handleAvatarFile = (e) => {
        setAvatarFile(URL.createObjectURL(e.target.files[0]));
    };

    const handleUpdateProject = async () => {
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
        let projectData = { title, description, developers: selectedDevs, pms: selectedManagers };
        if (marked) {
            projectData = { ...projectData, status: 'Completed' }
        }
        if (incompleted) {
            projectData = { ...projectData, status: 'In progress' }
        }
        try {
            await axios.put(process.env.REACT_APP_API_BASE_URL + "/project/" + project?._id, projectData)
            NotificationManager.success('Project updated', 'Success')
            project.fetchProjects();
            setMarked(false);
            setIncompleted(false);
        } catch (e) {
            NotificationManager.error('Error updating a project', 'Error')
        }
    }
    const handleUpdateProjectStatus = async (status) => {
        try {
            await axios.put(process.env.REACT_APP_API_BASE_URL + "/project/" + project?._id, { status })
            NotificationManager.success('Project updated', 'Success')
            project.fetchProjects();
        } catch (e) {
            NotificationManager.error('Error updating a project', 'Error')
        }
    }
    return (
        <div className="w-[460px] flex-col flex justify-start items-center">
            <Card className="rounded-[10px] project_dropdown h-[330px] w-[90%] border-[1px] shadow-sm dark:bg-[rgb(36,36,36)] bg-[#fff] border-none" style={{ gap: "0", border: "none", padding: '0px', borderRadius: '10px' }}>
                <div
                    className="flex justify-between px-[10px] w-[413px] -ml-[24px] -mt-[23px] rounded-t-[10px] h-[100px] dark:bg-[rgb(50,50,50)] bg-[#e1e1e1] flex justify-center items-center">
                    <div className="flex flex-row items-center">
                        <img
                            alt=""
                            src={projectImg}
                            className="relative rounded-full w-[80px]"
                        />
                        <h5
                            onClick={() => {
                                if (project.status === 'In progress') {
                                    navigate('/project/' + project?._id)
                                }
                            }}
                            className="hover:cursor-pointer mb-1 text-xl font-medium text-[rgb(25,118,210)] dark:text-white">
                            {project.title}
                        </h5>
                    </div>

                    <div className="flex fixed justify-end pt-1 pl-0 dropdown" style={{ fontFamily: 'Smack', paddingLeft: "0" }}>
                        <Dropdown inline label="" className=" pl-0" style={{ paddingLeft: "0" }}>
                            <Dropdown.Item onClick={handleDetail}>
                                <div
                                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    More Detail
                                </div>
                            </Dropdown.Item>
                            {user?.role.some((aRole) => aRole === 'Administrator') &&
                                <>
                                    <Dropdown.Item onClick={handleEdit}>
                                        <div
                                            className="block px-4 py-2 text-sm text-black hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            Edit
                                        </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={handleDelete}>
                                        <div
                                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            Delete
                                        </div>
                                    </Dropdown.Item>
                                </>
                            }
                        </Dropdown>
                    </div>
                </div>

                <div className="h-full cursor-pointer flex flex-col justify-start" style={{ fontFamily: 'Smack' }}>

                    <div className=" flex flex-col h-[100px] overflow-y-scroll">
                        <div className="text-sm text-gray-500 w-[full]  dark:text-gray-400 flex justify-start">{project.description.length > 150 ? project.description.slice(0, 150) + "..." : project.description}</div>
                    </div>
                    <div className="pb-[10px] px-[0px] w-full flex items-center justify-start">
                        <div className="  w-full flex justify-start items-start gap-[50px] ml-[0px]">
                            <div className='flex w-full'>
                                {project.developers?.length > 0 &&
                                    <div className='w-[50%] '>
                                        <div className='my-[5px] font-bold dark:text-gray-200'>
                                            Developers
                                        </div>
                                        <div className='flex mx-[20px] '>
                                            {
                                                project.developers?.map((a) => <UserAvatar user={a} />)
                                            }
                                        </div>
                                    </div>}
                                {project.pms?.length > 0 &&
                                    <div className='w-[50%]'>
                                        <div className='my-[5px] font-bold dark:text-gray-200'>
                                            Project managers
                                        </div>
                                        <div className='flex mx-[20px] '>
                                            {
                                                project.pms?.map((a) => <UserAvatar user={a} />)
                                            }
                                        </div>
                                    </div>}
                            </div>
                        </div>
                    </div>
                    <div >
                        <div>
                            <Label color={project.status === 'Idea'
                                ? 'primary'
                                :
                                project.status === 'To do'
                                    ? 'error'
                                    : project.status === 'In progress'
                                        ? 'warning'
                                        : 'success'}>{project.status}
                            </Label>
                        </div>
                    </div>
                </div>
            </Card>
            {openDetailModal ?
                <div className='fixed top-[0px] left-0 w-screen h-screen flex justify-center items-center z-[99]'>
                    <div className=' fixed w-screen h-screen top-0 left-0 bg-[#000] dark:bg-gray-500 opacity-40'>
                    </div>
                    <Zoom duration={500}>
                        <div className='fixed w-[600px] rounded-[10px] h-auto flex justify-start items-center top-[100px] z-50 bg-[#eee] dark:bg-[rgb(36,36,36)] shadow-md'>
                            <div className=' w-full h-full'>
                                <div className=' fixed top-[30px] right-[30px] cursor-pointer z-[99]' onClick={handleDetailCancel}>
                                    <XCircleIcon class="h-10 w-10 text-gray-800 dark:text-white" />
                                </div>
                                <div className=' z-10 ml-auto mt-[30px]'>
                                    <div className='justify-center m-auto flex group items-center h-[6rem] w-[6rem] overflow-y-hidden bg-[#e1e1e1] hover:bg-[#cbcbcb] transition-all dark:bg-[rgb(30,30,30)] dark:hover:bg-[rgb(33,33,33)] lg:h-[7rem] lg:w-[7rem] md:h-[7rem] md:w-[7rem] dark:border-[rgb(33,33,33)] border-[#ffffff] border-[5px] rounded-[50%]'>
                                        {avatarFile ?
                                            <span className='w-full h-full flex bg-contain bg-no-repeat bg-center overflow-y-hidden'>
                                                <img className='w-full h-fit' src={avatarFile} alt="" />
                                            </span>
                                            : <span className='w-full h-full'>
                                                {/* <img className=' w-full h-full' src='' alt="" /> */}
                                                <div className=' w-full h-full'>
                                                </div>
                                            </span>
                                        }
                                    </div>
                                </div>
                                <div className="w-full justify-center items-center text-center mt-[30px] text-[20px] text-[rgb(25,118,210)] dark:text-gray-300">
                                    {title}
                                </div>
                                <div className=" flex gap-[10px] justify-center items-center mt-[10px]">
                                    <span className=" w-[10px] h-[10px] rounded-[50%] bg-red-600"></span>
                                    <span className=" text-red-600">
                                        {status}
                                    </span>
                                </div>
                                <div className="w-full px-[20px] justify-center items-center text-center mt-[20px] ">
                                    <div className=" w-full h-[100px] text-[14px] overflow-y-scroll dark:text-gray-300">
                                        {description}
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center items-center mb-[50px]" style={{ fontFamily: 'Smack' }}>
                                    <div className="relative flex flex-col items-center rounded-[10px] w-[700px] max-w-[95%] mx-auto bg-clip-border shadow-3xl shadow-shadow-500 dark:text-white dark:!shadow-none p-3">
                                        <div className="grid md:grid-cols-2 gap-2 px-2 w-full mt-[50px]">
                                            <div className="flex flex-col items-start justify-center rounded-[10px] bg-[#fff] bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:bg-[rgb(33,33,33)] dark:shadow-none">
                                                <p className="text-sm text-gray-600 dark:text-gray-400" style={{ marginBottom: "10px" }}>Developers</p>
                                                <div className="text-base flex justify-start items-center font-medium text-navy-700 pl-[30px] mt-[20px] dark:text-gray-200" style={{ marginBottom: "0" }}>
                                                    {
                                                        // project.developers.map((a) => a.discordName)
                                                        project.developers.map((a) => <UserAvatar user={a} />)

                                                    }
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-center rounded-[10px] bg-[#fff] bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:bg-[rgb(33,33,33)] dark:shadow-none">
                                                <p className="text-sm text-gray-600 dark:text-gray-400" style={{ marginBottom: "10px" }}>Project Manager</p>
                                                <div className="text-base flex justify-start items-center font-medium text-navy-700 pl-[30px] mt-[20px] dark:text-gray-200" style={{ marginBottom: "0" }}>
                                                    {
                                                        // project.pms.map((a) => a.discordName)
                                                        project.pms.map((a) => <UserAvatar user={a} />)

                                                    }                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Zoom>
                </div>
                : <></>}
            {openEditModal ?
                <div className='fixed top-[0px] left-0 w-screen h-screen flex justify-center items-center z-[99]'>
                    <div className=' fixed w-screen h-screen top-0 left-0 bg-[#000] dark:bg-gray-500 opacity-40'>
                    </div>
                    <Zoom duration={500}>
                        <div className='fixed w-[1000px] rounded-[10px] h-auto flex justify-start items-center top-[30px] z-[111] bg-[#eee] dark:bg-[rgb(36,36,36)] shadow-md'>

                            <div className='flex justify-center items-start w-[100%] overflow-y-visible flex-col px-[10px] sm:px-[100px]' style={{ fontFamily: 'Smack' }}>
                                {/* <div className=' flex justify-center items-center  md:justify-start md:items-start text-[rgb(18,18,18)] w-full dark:text-white text-[30px] mt-[30px] lg:mt-[-30px]'>Profile details</div> */}
                                <div className=' fixed top-[30px] right-[30px] cursor-pointer z-[99]' onClick={() => { handleEditCancel() }}>
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
                                            onChange={({ target: { value } }) => setTitle(value)}
                                            defaultValue={project.title}
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
                                            className='w-full' id="outlined-basic" label="Title" variant="outlined" />
                                    </div>
                                    <div className='w-full items-start flex-col mt-[40px]'>
                                        <TextField
                                            onChange={({ target: { value } }) => setDescription(value)}
                                            defaultValue={project.description}
                                            className='w-full'
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
                                            defaultValue={selectedDevelopers}
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
                                                        variant="outlined"
                                                        label="Developers"
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
                                            defaultValue={selectedPms}

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
                                                        variant="outlined"
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
                                        {status === 'In progress' &&
                                            <FormControlLabel control={<Checkbox onChange={({ target: { checked } }) => {
                                                setMarked(checked);
                                            }} />} label="Mark as completed" />
                                        }
                                        {status === 'Completed' &&
                                            <FormControlLabel control={<Checkbox onChange={({ target: { checked } }) => {
                                                setIncompleted(checked);
                                            }} />} label="Mark as incompleted" />
                                        }
                                    </div>

                                </div>

                                <div className=' flex gap-[10px] justify-center items-center w-full mt-[50px] mb-[40px]'>
                                    <div onClick={handleUpdateProject} style={{ fontFamily: 'Might', width: '200px', fontSize: '18px', transition: '0.1s' }} className="relative rounded-[15px]  cursor-pointer group font-medium no-underline flex p-2 text-white items-center justify-center content-center focus:outline-none">
                                        <span className="absolute top-0 left-0 w-full h-full rounded-[15px] opacity-50 filter blur-sm bg-gradient-to-br from-[#256fc4] to-[#256fc4]"  ></span>
                                        <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-[#256fc4] to-[#256fc4]"></span>
                                        <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-[#256fc4] to-[#256fc4]"></span>
                                        <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-[#256fc4] from-[#256fc4]"></span>
                                        <span className="relative">Update</span>
                                    </div>
                                    {status === 'To do' && < div onClick={() => handleUpdateProjectStatus('In progress')} style={{ fontFamily: 'Might', width: '200px', fontSize: '18px', transition: '0.1s' }} className="relative rounded-[15px]  cursor-pointer group font-medium no-underline flex p-2 text-white items-center justify-center content-center focus:outline-none">
                                        <span className="absolute top-0 left-0 w-full h-full rounded-[15px] opacity-50 filter blur-sm bg-gradient-to-br from-[#256fc4] to-[#256fc4]"  ></span>
                                        <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-[#256fc4] to-[#256fc4]"></span>
                                        <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-[#256fc4] to-[#256fc4]"></span>
                                        <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-[#256fc4] from-[#256fc4]"></span>
                                        <span className="relative">Start Project</span>
                                    </div>}
                                    {status === 'Idea' && < div onClick={() => handleUpdateProjectStatus('To do')} style={{ fontFamily: 'Might', width: '200px', fontSize: '18px', transition: '0.1s' }} className="relative rounded-[15px]  cursor-pointer group font-medium no-underline flex p-2 text-white items-center justify-center content-center focus:outline-none">
                                        <span className="absolute top-0 left-0 w-full h-full rounded-[15px] opacity-50 filter blur-sm bg-gradient-to-br from-[#256fc4] to-[#256fc4]"  ></span>
                                        <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-[#256fc4] to-[#256fc4]"></span>
                                        <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-[#256fc4] to-[#256fc4]"></span>
                                        <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-[#256fc4] from-[#256fc4]"></span>
                                        <span className="relative">Accept New Idea</span>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </Zoom>
                </div >
                : <></>
            }
        </div >

    );
}
