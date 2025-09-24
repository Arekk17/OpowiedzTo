import React from "react";
import Image from "next/image";
import { ProfileCounters } from "../../molecules/profile/ProfileCounters";

export interface ProfileHeaderProps {
  name: string;
  bio?: string;
  avatarSrc?: string;
  followers: number;
  following: number;
  stories: number;
  className?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  bio,
  avatarSrc,
  followers,
  following,
  stories,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-row items-start p-4 w-full max-w-[960px] ${className}`}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex flex-col items-center gap-4 w-full max-w-[531px] mx-auto">
          <div className="relative w-32 h-32 min-h-32 rounded-full overflow-hidden">
            {avatarSrc ? (
              <Image src={avatarSrc} alt={name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-accent to-accent-mystery" />
            )}
          </div>

          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="font-jakarta font-bold text-[22px] leading-[28px] text-content-primary text-center">
              {name}
            </h1>
            {bio && (
              <p className="font-jakarta font-normal text-base leading-6 text-content-secondary text-center mt-1">
                {bio}
              </p>
            )}

            <ProfileCounters
              className="mt-1"
              followers={followers}
              following={following}
              stories={stories}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
