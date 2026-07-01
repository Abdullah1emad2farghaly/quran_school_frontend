import React, { useState } from "react";
// import { useForm } from "react-hook-form";
import { Phone } from "lucide-react";
import Input from "../ui/Input";
import PasswordInput from "../ui/PasswordInput";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import { SignIn } from "../../api/services/authService";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ isLoading, defaultPhone = "" }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState({
    phone: "",
    password: ""
  })

  const [errors, setErrors] = useState({
    errorPhone: "",
    errorPassword: ""
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      errorPhone: "",
      errorPassword: ""
    };

    if (!userData.phone) {
      newErrors.errorPhone = "رقم الهاتف مطلوب";
    }

    if (!userData.password) {
      newErrors.errorPassword = "كلمة المرور مطلوبة";
    }

    setErrors(newErrors);

    if (newErrors.errorPhone || newErrors.errorPassword) {
      return;
    }

    try {
      const res = await SignIn(userData);
      setErrorMessage("");
      window.localStorage.setItem('token', res.data.accessToken);
      window.localStorage.setItem('refreshToken', res.data.refreshToken);
      login(res.data.user);
      
      navigate(`/${res.data.user.role.toLowerCase()}`);

    } catch (error) {
      setErrorMessage(error.msg);
    }
  };

  return (
    <form
      noValidate
      onSubmit={(e) => handleSubmit(e)}
      className="space-y-5">
      {errorMessage && <Alert variant="error">{errorMessage}</Alert>}

      <Input
        id="phoneNumber"
        label="رقم الهاتف"
        icon={Phone}
        error={errors.errorPhone}
        setUserData={setUserData}
        userData={userData}
      />

      <PasswordInput
        error={errors.errorPassword}
        setUserData={setUserData}
        userData={userData}
      />

      <Button type="submit" isLoading={isLoading}>
        تسجيل الدخول
      </Button>
    </form>
  );
}
