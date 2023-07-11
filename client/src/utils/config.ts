import { io } from "socket.io-client";

export const baseURL = "https://docupot.roketo.cloud/api/v1";

export const socket = io("http://localhost:8000", {
    autoConnect: false
});

export const editorToolbarOptions = [
    [
        {
            header: [
                1,
                2,
                3,
                4,
                5,
                6,
                false
            ]
        }
    ],
    [
        {
            font: []
        }
    ],
    [
        {
            list: "ordered"
        },
        {
            list: "bullet"
        }
    ],
    [
        "bold",
        "italic",
        "underline"
    ],
    [
        {
            color: []
        },
        {
            background: []
        }
    ],
    [
        {
            script: "sub"
        },
        {
            script: "super"
        }
    ],
    [
        {
            align: []
        }
    ],
    [
        "image",
        "blockquote",
        "code-block"
    ],
    [
        "clean"
    ],
];