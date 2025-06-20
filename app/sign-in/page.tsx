"use client";

import { SignInForm } from "@/components/form/sign-in-form";
import { SignUpForm } from "@/components/form/sign-up-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export default function AuthPage() {
    return (
        <div className="flex min-h-screen bg-gray-700">
            <div className="flex w-full h-1/2 max-w-7xl m-auto rounded-lg shadow-lg overflow-hidden bg-gray-800">
                {/* Left square: Logo and Lorem Ipsum */}
                <div className="w-3/5 p-8 flex flex-col justify-center items-center text-white">
                    <Image
                        src="/baner.png"
                        alt="Logo"
                        width={400}
                        height={0}
                        className="p-2 rounded-xl"
                    />
                    <p className="text-center">
                        &quot;Nowoczesna aplikacja webowa do projektowania i zarządzania architekturą systemów IIoT 4.0. Umożliwia intuicyjne budowanie topologii przemysłowych sieci IoT za pomocą interaktywnego edytora typu drag-and-drop (React Flow), zarządzanie urządzeniami, przepływem danych, uprawnieniami użytkowników oraz monitorowanie stanu systemu w czasie rzeczywistym. Dzięki integracji z bazą danych i modularnej architekturze (RBAC, REST API, harmonogramy, automatyzacje), aplikacja wspiera cyfrową transformację przemysłu i pozwala na elastyczne modelowanie struktur zakładów, linii produkcyjnych, sensorów i jednostek wykonawczych.&quot;
                    </p>
                </div>

                {/* Right square: Tabs with forms */}
                <div className="w-2/5 p-8 flex items-center justify-center border-l border-gray-700">
                    <div className="w-full max-w-sm">
                        <Tabs defaultValue="signin" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="signin">Login</TabsTrigger>
                                <TabsTrigger value="signup">Rejestracja</TabsTrigger>
                            </TabsList>
                            <TabsContent value="signin">
                                <SignInForm />
                            </TabsContent>
                            <TabsContent value="signup">
                                <SignUpForm />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
