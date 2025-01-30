'use client';
import {CONTENT} from "@/constant";
import Editor from "@/components/Editor";

export default function Home() {


    const handleSave = async (markdown: string) => {
        try {

            console.log(markdown);
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    return (
        <div className="container p-8">
            <Editor
                content={ CONTENT }
                onSave={handleSave}
            />
        </div>
    );

}
