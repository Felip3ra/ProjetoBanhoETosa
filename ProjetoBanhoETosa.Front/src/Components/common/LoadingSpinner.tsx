const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-600">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
      <p className="text-sm">Carregando...</p>
    </div>
  );
};

export default LoadingSpinner;
