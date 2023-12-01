'use client';

import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRegister } from "./useRegister";

export default function RegisterForm() {

    const [show, setShow] = useState(true)
    const {register, handleSubmit, handleRegister, errors} = useRegister()


    return(
        <form 
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(handleRegister)}
        >
            <Input
                label='Username'
                type="text"
                {...register("username")}
                color={`${errors.username ? 'danger' : 'default'}`}
                errorMessage={errors.username && errors.username.message}
            />
            <Input
                label='Email'
                type="email"
                {...register("email")}
                color={`${errors.email ? 'danger' : 'default'}`}
                errorMessage={errors.email && errors.email.message}
            />
            <Input
                label='Password'
                {...register("password")}
                color={`${errors.password ? 'danger' : 'default'}`}
                errorMessage={errors.password && errors.password.message}
                endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setShow(!show)}
                    >
                      {show ? (
                        <AiOutlineEye className="pointer-events-none text-2xl text-default-400" />
                      ) : (
                        <AiOutlineEyeInvisible className="pointer-events-none text-2xl text-default-400" />
                      )}
                    </button>
                  }
                  type={show ? "password" : "text"}
            />
            <Input
                label='Confirm Password'
                {...register("confirmPassword")}
                color={`${errors.confirmPassword ? 'danger' : 'default'}`}
                errorMessage={errors.confirmPassword && errors.confirmPassword.message}
                endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setShow(!show)}
                    >
                      {show ? (
                        <AiOutlineEye className="pointer-events-none text-2xl text-default-400" />
                      ) : (
                        <AiOutlineEyeInvisible className="pointer-events-none text-2xl text-default-400" />
                      )}
                    </button>
                  }
                  type={show ? "password" : "text"}
            />
            <Button radius="full" size="md" color="primary" type="submit">
                Register
            </Button>
        </form>
    )
}