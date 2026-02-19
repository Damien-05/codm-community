import toast from 'react-hot-toast';
import { Trophy, Zap, Award, Star } from 'lucide-react';

export const toastSuccess = (message) => {
  return toast.success(message);
};

export const toastError = (message) => {
  return toast.error(message);
};

export const toastInfo = (message) => {
  return toast(message, {
    icon: '💡',
  });
};

export const toastLoading = (message) => {
  return toast.loading(message);
};

export const toastAchievement = (achievement) => {
  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-gradient-to-r from-cod-orange to-cod-gold shadow-lg rounded-lg pointer-events-auto flex items-center gap-4 p-4 border-2 border-cod-orange`}
      >
        <div className="flex-shrink-0">
          <Award className="h-8 w-8 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">🎉 Badge Débloqué !</p>
          <p className="text-lg font-orbitron text-black">{achievement.name}</p>
          <p className="text-xs text-black/80">{achievement.description}</p>
          <p className="text-xs font-bold text-white mt-1">+{achievement.points} points</p>
        </div>
      </div>
    ),
    {
      duration: 6000,
      position: 'top-center',
    }
  );
};

export const toastTournamentStart = (tournamentName) => {
  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-slate-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-4 p-4 border-2 border-cod-orange`}
      >
        <div className="flex-shrink-0">
          <Trophy className="h-8 w-8 text-cod-orange animate-pulse" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-cod-orange">Tournoi en Cours !</p>
          <p className="text-white">{tournamentName}</p>
          <p className="text-xs text-gray-400 mt-1">Bonne chance ! 🎮</p>
        </div>
      </div>
    ),
    { duration: 5000 }
  );
};

export const toastMatchFound = () => {
  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-slate-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-4 p-4 border-2 border-gaming-accent`}
      >
        <div className="flex-shrink-0">
          <Zap className="h-8 w-8 text-gaming-accent animate-pulse" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gaming-accent">Match Trouvé !</p>
          <p className="text-white">Préparez-vous au combat</p>
        </div>
      </div>
    ),
    { duration: 5000 }
  );
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export const dismissAllToasts = () => {
  toast.dismiss();
};
