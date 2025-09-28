import React from 'react'

import {saveReport} from "@/lib/storage/reports";
import createReport from "@/lib/dev/createReport";

import type PickedImage from "@/types/PickedImage";
import Report from "@/types/Report";

type ProcessProps = {
    images: PickedImage[];
    reportsCounter: number[];
    setReportsCounter: React.Dispatch<React.SetStateAction<number[]>>
}
export default function process({images, reportsCounter, setReportsCounter}: ProcessProps): void {
    for (let image of images) {
        createReport(image).then((report) => {
            saveReport(report).catch((err) => console.log(err));
            setReportsCounter([reportsCounter[0], reportsCounter[1] + 1]);
        })

    }
}