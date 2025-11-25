import { usePage } from "@inertiajs/react";
import Submitted from "./submitted";
import Submit from "./Submit";

export default function Attendance() {
    const { submitted } = usePage().props;

    if (submitted) {
        return <Submitted />; // Informasi sudah absen
    } else {
        return <Submit />; // Form absen
    }
}
