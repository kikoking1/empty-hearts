import React, { useState } from "react";


export const AuthForm = () => {

const [email, setEmail] = useState("");

const [password, setPassword] = useState("");

const [isLogin, setIsLogin] = useState(true);

const [isLoading, setIsLoading] = useState(false);

const [error, setError] = useState("");

const dispatch = useDispatch();

const history = useHistory();

const authHandler = async (event: React.FormEvent) => {

event.preventDefault();

setIsLoading(true);

setError("");

if (isLogin) {

try {

const response = await fetch(


)
}
}