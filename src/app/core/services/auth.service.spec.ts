import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { UsuariosService } from '../services/usuarios.service';
import { USUARIOS } from '../../layouts/dashboard/pages/users/models';
import { HttpClientModule } from '@angular/common/http';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { authActions } from './../../store/auth.actions';
import { authIsLogin, authUserLogin, authRolLogin } from '../../store/auth.selectors';

describe('AuthService', () => {
  let service: AuthService;
  let usuariosService: UsuariosService;
  let store: MockStore;
  const initialState = {
    auth: {
      isLogin: false,
      userLogin: null,
      rolLogin: null,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, StoreModule.forRoot({})],
      providers: [
        AuthService,
        UsuariosService,
        provideMockStore({ initialState }),
      ],
    });
    service = TestBed.inject(AuthService);
    usuariosService = TestBed.inject(UsuariosService);
    store = TestBed.inject(Store) as MockStore;
  });

  it('Debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });


  it('Debe iniciar sesión correctamente', (done: DoneFn) => {
    const mockUsuarios: USUARIOS[] = [
      {
        id: 1,
        userName: 'admin',
        nombre: 'Admin',
        apellido: 'Admin',
        telefono: '12315464',
        email: 'admin@admin.com',
        activo: true,
        avatar: '',
        rol: 'admin',
        password: 'admin',
      },
    ];
    spyOn(usuariosService, 'getUsuarios').and.returnValue(of(mockUsuarios));
    const storeDispatchSpy = spyOn(store, 'dispatch');

    service.login('admin', 'admin').subscribe((isAuthenticated) => {
      expect(isAuthenticated).toBeTrue();
      expect(storeDispatchSpy).toHaveBeenCalledWith(
        authActions.login({ username: 'admin', rol: 'admin', avatar: '' })
      );
      done();
    });
  });

  it('Debería cerrar sesión correctamente. Luego llamar al método router.navigate', () => {
    localStorage.setItem('user', 'test');
    localStorage.setItem('rol', 'admin');
    const storeDispatchSpy = spyOn(store, 'dispatch');
    const SpyOnrouterNavigate = spyOn((service as any).router, 'navigate');

    service.logout();
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('rol')).toBeNull();
    expect(storeDispatchSpy).toHaveBeenCalledWith(authActions.logout());
    expect(SpyOnrouterNavigate).toHaveBeenCalledWith(['']);
  });

  it('Debería devolver verdadero si el token está presente', () => {
    localStorage.setItem('user', 'test');
    localStorage.setItem('rol', 'admin');
    store.overrideSelector(authUserLogin, null);
    store.overrideSelector(authRolLogin, null);
    const result = service.verifyToken();
    expect(result).toBeTrue();
  });


  it('Debería devolver rechazar si el token no está permitido', () => {
    localStorage.removeItem('user');
    localStorage.removeItem('rol');
    const result = service.verifyToken();
    expect(result).toBeFalse();
  });

  it('Debería obtener datos de usuario del store', (done: DoneFn) => {
    store.overrideSelector(authUserLogin, 'test');
    store.overrideSelector(authRolLogin, 'admin');

    service.getUserData().subscribe((userData) => {
      expect(userData).toEqual({ usuario: 'test', rol: 'admin' });
      done();
    });
  });
});
