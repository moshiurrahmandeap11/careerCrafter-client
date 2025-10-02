import { Award, Bell, MessageCircle, Share2, ThumbsUp, UserPlus, Users } from "lucide-react";



export const NotificationIcon = ({ type, priority }) => {
    const getIconProps = () => {
        switch (type) {
            case 'connection':
                return { icon: UserPlus, color: 'text-blue-600', bgColor: 'bg-blue-50' };
            case 'reaction':
                return { icon: ThumbsUp, color: 'text-green-600', bgColor: 'bg-green-50' };
            case 'message':
                return { icon: MessageCircle, color: 'text-purple-600', bgColor: 'bg-purple-50' };
            case 'mention':
                return { icon: Share2, color: 'text-orange-600', bgColor: 'bg-orange-50' };
            case 'job':
                return { icon: Award, color: 'text-amber-600', bgColor: 'bg-amber-50' };
            case 'recommendation':
                return { icon: Users, color: 'text-indigo-600', bgColor: 'bg-indigo-50' };
            default:
                return { icon: Bell, color: 'text-gray-600', bgColor: 'bg-gray-50' };
        }
    };

    const { icon: Icon, color, bgColor } = getIconProps();

    return (
        <div className={`p-2 rounded-lg ${bgColor} ${color} relative`}>
            <Icon className="w-4 h-4" />
            {priority === 'high' && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
        </div>
    );
};