"use client";

import axios from "axios";

const apiAxios = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

module.exports = { apiAxios };
