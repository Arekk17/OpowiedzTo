import Image from "next/image"
interface ProfileAvatarProps {
    src?: string;
    alt?: string;
    size?: 'sm' | 'md' | 'lg';
}
export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({src, alt='Profile', size='md'}) => {
    const sizeClasses = size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-16 h-16'
    
    return (
        <div className={`${sizeClasses} rounded-full overflow-hidden`}>
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    width={size === 'sm' ? 32 : size === 'md' ? 40 : 64}
                    height={size === 'sm' ? 32 : size === 'md' ? 40 : 64}
                    className="w-full h-full object-cover rounded-full"
                />

            ):(
        <div className="w-full h-full bg-gradient-to-br from-primary-accent to-accent-mystery rounded-full"/>
            )}
        </div>
    )
}