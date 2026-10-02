import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";

import GlassCard from "../../components/ui/GlassCard";
import InputField from "../../components/ui/InputField";
import PasswordInput from "../../components/ui/PasswordInput";
import PrimaryButton from "../../components/ui/PrimaryButton";

import { login } from "../../services/authService";
import useAuthStore from "../../store/authStore";

function Login() {

    const navigate = useNavigate();

    const loginStore = useAuthStore(
        (state) => state.login
    );

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (formData) => {

        try {

            setLoading(true);

            const response = await login(formData);

            /*
             * authService already returns response.data.
             * Therefore response itself contains:
             *
             * {
             *   token,
             *   userId,
             *   email,
             *   role
             * }
             */

            loginStore(response);

            navigate("/dashboard", {
                replace: true
            });

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            if (error.response?.data?.message) {

                alert(
                    error.response.data.message
                );

            } else if (error.message) {

                alert(error.message);

            } else {

                alert(
                    "Unable to login. Please check that the backend is running."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    return (

        <GlassCard>

            <div className="flex flex-col items-center">

                <FaUserCircle
                    className="text-white text-8xl mb-6"
                />

                <h1 className="text-white text-3xl font-bold">
                    LabTrack
                </h1>

                <p className="text-white/70 mt-2 mb-10 text-center">
                    Laboratory Inventory Management System
                </p>

            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
            >

                <InputField
                    icon={FaEnvelope}
                    placeholder="Email Address"
                    error={errors.email?.message}
                    {...register("email", {
                        required: "Email is required"
                    })}
                />

                <PasswordInput
                    placeholder="Password"
                    error={errors.password?.message}
                    {...register("password", {
                        required: "Password is required"
                    })}
                />

                <div className="flex justify-between text-sm text-white/80">

                    <label className="flex gap-2 items-center">

                        <input
                            type="checkbox"
                            className="accent-blue-500"
                        />

                        Remember Me

                    </label>

                    <button
                        type="button"
                        className="hover:text-white"
                    >
                        Forgot Password?
                    </button>

                </div>

                <PrimaryButton
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Logging in..."
                        : "LOGIN"
                    }

                </PrimaryButton>

            </form>

        </GlassCard>

    );
}

export default Login;