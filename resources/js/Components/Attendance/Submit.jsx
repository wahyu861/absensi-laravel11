import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm } from "@inertiajs/react";
import Selectbox from "@/Components/SelectBox";
import { useState, useEffect } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

export default function Submit() {
    const [transitioning, setTransitioning] = useState(false);

    const { data, setData, post, errors, processing, transform } = useForm({
        status: "attend",
        description: "",
        latitude: "",
        longitude: "",
        address: "",
        prepareData: {},
    });

    const getLatLing = (e) => {
        e.preventDefault();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                createGeocoder(position.coords);
            },
            () => {
                alert("Tidak bisa mendapatkan lokasi");
            }
        );
    };

    async function createGeocoder(coordinates) {
        // try {
        //     setOptions({
        //         apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        //         version: "weekly",
        //     });

        //     const { Geocoder } = await importLibrary("geocoding");

        //     const geocoder = new Geocoder();

        //     geocoder
        //         .geocode({
        //             location: {
        //                 lat: coordinates.latitude,
        //                 lng: coordinates.longitude,
        //             },
        //         })
        //         .then((response) => {
        //             if (!response.results[0]) {
        //                 alert("Tidak bisa mendapatkan lokasi");
        //             }

        //             // set prepareData
        //             let objLocation = {
        //                 latitude: coordinates.latitude,
        //                 longitude: coordinates.longitude,
        //                 address: response.results[0].formatted_address,
        //             };

        //             setData("prepareData", objLocation);
        //         });
        // } catch (err) {
        //     console.log("Google Maps Error:", err);
        // }
        setData("prepareData", {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            address: "Alamat dummy (Google Maps nonaktif)",
        });
    }

    // sebelum submit transform data
    useEffect(() => {
        if (data.prepareData?.hasOwnProperty("address")) {
            transform((data) => ({
                ...data.prepareData,
                status: data.status,
                description: data.description,
            }));

            post(route("attendances.submit"), {
                preserveScroll: true,
                onSuccess: () => {
                    alert("Absensi berhasil disubmit");
                },
                onError: (errors) => {
                    console.log(errors);
                },
            });
        }
    }, [data.prepareData]);

    useEffect(() => {
        setTransitioning(data.status !== "attend");
    }, [data.status]);

    return (
        <form onSubmit={getLatLing} className="mt-6 space-y-6">
            <div>
                <InputLabel
                    className="mb-3"
                    htmlFor="info"
                    value="Silahkan melakukan absensi"
                />

                <Selectbox
                    onChange={(e) => setData("status", e.target.value)}
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                    options={[
                        { value: "attend", label: "Hadir" },
                        { value: "leave", label: "Cuti" },
                        { value: "sick", label: "Sakit" },
                        { value: "permit", label: "Izin" },
                        { value: "business_trip", label: "Perjalanan Dinas" },
                        {
                            value: "remote",
                            label: "Kerja Remote (diluar kantor)",
                        },
                    ]}
                />

                <InputError className="mt-2" message={errors.status} />
            </div>

            <Transition
                show={transitioning}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
            >
                <div>
                    <InputLabel
                        className="mb-3"
                        htmlFor="description"
                        value="Penjelasan"
                    />

                    <TextInput
                        onChange={(e) => setData("description", e.target.value)}
                        className="w-full"
                    />

                    <InputError className="mt-2" message={errors.description} />
                </div>
            </Transition>

            <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>Absensi</PrimaryButton>
            </div>
        </form>
    );
}
