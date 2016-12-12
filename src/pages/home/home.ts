import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Data } from '../../providers/data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    @ViewChild('slides') slides: any;

    hasAnswered: boolean = false;
    score: number = 0;
    life: number = 3;

    slideOptions: any;
    questions: any;

    constructor(public navCtrl: NavController, public dataService: Data) {

        this.slideOptions = {
            onlyExternal: true
        };

    }

    ionViewDidLoad() {

        this.dataService.load().then((data) => {

            data.map((question) => {

                let originalOrder = question.answers;
                question.answers = this.randomizeAnswers(originalOrder);
                return question;

            });

            this.questions = data;

        });

    }

    nextSlide(){
        this.slides.slideNext();
    }

    selectAnswer(answer, question){

        this.hasAnswered = true;
        answer.selected = true;
        question.flashCardFlipped = true;

        if(answer.correct){
            this.score++;
        }else{
            this.life--;
        }

        setTimeout(() => {

          this.hasAnswered = false;
          answer.selected = false;
          question.flashCardFlipped = false;

          if (this.life === 0) {
            this.restartQuiz();
          }else{
            this.nextSlide();
          }

        }, 3000);
    }

    randomizeAnswers(rawAnswers: any[]): any[] {

        for (let i = rawAnswers.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = rawAnswers[i];
            rawAnswers[i] = rawAnswers[j];
            rawAnswers[j] = temp;
        }

        return rawAnswers;

    }

    restartQuiz(){
        this.score = 0;
        this.life = 3;
        this.slides.slideTo(1, 1000);
    }

}
