import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    return (
        <div className="flex flex-wrap gap-2 mt-4">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        className={
                            link.active
                                ? "bg-indigo-600 text-white px-4 py-2 border border-indigo-600 rounded-md"
                                : "text-indigo-600 hover:bg-indigo-600 hover:text-white px-4 py-2 border rounded-md"
                        }
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={index}
                        className="text-gray-500 px-4 py-2 border rounded-md"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            )}
        </div>
    );
}
