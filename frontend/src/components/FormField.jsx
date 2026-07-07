function FormField({ label, hint, className = '', children }) {
    return (
        <label className={`flex flex-col gap-1.5 ${className}`}>
            <span className="text-xs font-medium" style={{ color: 'var(--admin-muted)' }}>
                {label}
            </span>
            {children}
            {hint && (
                <span className="text-xs" style={{ color: 'var(--admin-muted)', opacity: 0.8 }}>
                    {hint}
                </span>
            )}
        </label>
    )
}

export default FormField