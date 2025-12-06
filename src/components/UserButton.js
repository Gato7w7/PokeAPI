import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function UserButton({ user, onLoginClick }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowMenu(false);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        style={{
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          border: 'none',
          borderRadius: '12px',
          padding: '10px 20px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s',
        }}
      >
        Iniciar Sesión
      </button>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          background: '#1F2937',
          border: '2px solid #374151',
          borderRadius: '12px',
          padding: '8px 16px',
          color: '#F9FAFB',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'all 0.2s',
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '16px',
          fontWeight: '700',
        }}>
          {user.displayName ? user.displayName.charAt(0).toUpperCase() : '👤'}
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '14px', lineHeight: '1.2' }}>
            {user.displayName || 'Usuario'}
          </div>
          <div style={{ fontSize: '11px', color: '#9CA3AF', lineHeight: '1.2' }}>
            Ver perfil ▼
          </div>
        </div>
      </button>

      {showMenu && (
        <>
          <div
            onClick={() => setShowMenu(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            }}
          />
          <div style={{
            position: 'absolute',
            top: '60px',
            right: 0,
            background: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            minWidth: '200px',
            zIndex: 20,
            overflow: 'hidden',
            animation: 'menuSlideIn 0.2s ease',
          }}>
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #374151',
            }}>
              <div style={{ color: '#F9FAFB', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                {user.displayName || 'Usuario'}
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '12px' }}>
                {user.email}
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                padding: '12px 16px',
                color: '#EF4444',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Cerrar Sesión
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes menuSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}