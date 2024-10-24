import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';



export default function User_cards({user}) {
    const router = useRouter();
    let calculate_age;
    calculate_age = (dob1) => {
        var today = new Date();
        var birthDate = new Date(user.date_of_birth);
        var age_now = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
        {
            age_now--;
        }
        console.log(age_now);
        return age_now;
    }
    return (
        <main className="h-120">

                        <div key={user.id} className="border p-4 rounded shadow-md">
                            <img src={user.profile_picture}/>
                            <h2 className="font-bold text-black text-lg">{user.name} {user.surname}</h2>
                            <p className="text-sm text-black">age : {calculate_age(user.date_of_birth)}</p>
                        </div>

        </main>
    );
}
