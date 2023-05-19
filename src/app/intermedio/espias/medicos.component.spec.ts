import { MedicosComponent } from './medicos.component';
import { MedicosService } from './medicos.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';


describe('MedicosComponent', () => {

    let componente: MedicosComponent; //instancias
    const servicio = new MedicosService(null); //instancias. Como no se va a usar el http porque son pruebas, entonces se manda null

    beforeEach( () => {
        componente = new MedicosComponent(servicio);
    });


    it('Init: Debe de cargar los médicos', () => {

        const medicos = ['medico1', 'medico2', 'medico3'];

        spyOn( servicio, 'getMedicos' ).and.callFake( () => { //SpyOn permite hacer peticiones falsas cuando algo suceda

            return Observable.from( [  medicos  ] ); //en este caso el servicio regresa un observable por lo que acá tambien
        });


        componente.ngOnInit();// iniciar el ngOnit

        expect( componente.medicos.length ).toBeGreaterThan(0);

    });


    it( 'Debe de llamar al servidor para agregar un médico', () => {

        const espia = spyOn( servicio, 'agregarMedico' ).and.callFake( medico => {
            return Observable.empty(); // no intereza la respuesta entonces el empty es muy adecuado para esta prueba
        });

        componente.agregarMedico();

        expect( espia ).toHaveBeenCalled(); // para saber si ese agregar medico es llamado o no

    });


    it( 'Debe de agregar un nuevo médico al arreglo de médicos', () => {

        const medico = { id: 1, nombre: 'Juan' };

        spyOn( servicio, 'agregarMedico' )
                .and.returnValue(  Observable.from( [  medico  ] )   );

       componente.agregarMedico();

       expect( componente.medicos.indexOf( medico ) ).toBeGreaterThanOrEqual(0);

    });

    it( 'Si falla la adicion, la propiedad mensajeError, debe ser igual al error del servicio', () => { 

        const miError = 'Nose pudo agregar el médico';

        spyOn( servicio, 'agregarMedico' ).and
                .returnValue( Observable.throw( miError ) );

        componente.agregarMedico();

        expect( componente.mensajeError ).toBe( miError );
    });


    it( 'Debe de llamar al servidor para borrar un médico', () => {

        spyOn( window, 'confirm' ).and.returnValue(true);


        const espia = spyOn( servicio, 'borrarMedico' )
                            .and.returnValue( Observable.empty() );

       componente.borrarMedico('1');

       expect( espia ).toHaveBeenCalledWith('1'); //lo importante es que la funcion sea llamada, pero en este caso pide un id y toca enviarselo

    });

    it( 'NO debe de llamar al servidor para borrar un médico', () => {

        spyOn( window, 'confirm' ).and.returnValue(false);


        const espia = spyOn( servicio, 'borrarMedico' )
                            .and.returnValue( Observable.empty() );

       componente.borrarMedico('1');

       expect( espia ).not.toHaveBeenCalledWith('1'); //no ha sido llamado

    });



});
