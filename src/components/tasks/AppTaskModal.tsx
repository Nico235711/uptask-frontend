import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TaskForm from './TaskForm';
import { useForm } from 'react-hook-form';
import { TaskFormData } from '@/types/index';
import { useMutation } from '@tanstack/react-query';
import { createTask } from '@/api/TaskAPI';
import { toast } from 'react-toastify';

export default function AddTaskModal() {

  const initialValues: TaskFormData = {
    name: "",
    description: ""
  }

  const { mutate } = useMutation({
    mutationFn: createTask,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
      reset()
      navigate(location.pathname , { replace: true })
    }
  })
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues: initialValues })
  const navigate = useNavigate()
  // leer si el modal existe
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const modalTask = queryParams.get("newTask")
  const show = modalTask ? true : false

  // obtener el id del proyecto de la url
  const params = useParams()
  const projectId = params.projectId!

  const handleCreateTask = (formData: TaskFormData) => {
    const data = {
      formData,
      projectId
    }

    mutate(data)
  }
  
  return (
    <>
      <Transition appear show={show} as={Fragment}>
        {/* navigate("" , { replace: true } -> elimina el query string de la url */}
        <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname , { replace: true })}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                  <DialogTitle
                    as="h3"
                    className="font-black text-4xl  my-5"
                  >
                    Nueva Tarea
                  </DialogTitle>

                  <p className="text-xl font-bold">Llena el formulario y crea  {''}
                    <span className="text-fuchsia-600">una tarea</span>
                  </p>

                  <form className='mt-10 space-y-2' noValidate onSubmit={handleSubmit(handleCreateTask)}>

                    <TaskForm register={register} errors={errors} />

                    <input
                      type="submit"
                      value="Guardar Tarea" 
                      className='bg-purple-400 hover:bg-purple-500 text-white px-5 py-1 mt-5 inline-block font-bold transition-all w-full cursor-pointer'
                    />
                  </form>

                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}