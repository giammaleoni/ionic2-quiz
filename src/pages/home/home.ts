import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Data } from '../../providers/data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('slides') slides: any;

  //Game constants
  gTime: number = 30000;
  gLife: number = 3;
  gScore: number = 0;

  hasAnswered: boolean = false;
  score: number = this.gScore;
  life: number = this.gLife;
  time: number = this.gTime;
  slideOptions: any;
  questions: any;

  constructor(public navCtrl: NavController, public dataService: Data) {

    this.slideOptions = {
      onlyExternal: true
    };

  }

  ionViewDidLoad() {

    this.dataService.load().then((data) => {

      data.map((questions) => {

        let originalOrder = questions.answers;
        questions.answers = this.shuffle(originalOrder);
        return questions;

      });

      this.questions = data;

    });

  }

  nextSlide(){
    this.slides.slideNext();
    this.time = this.gTime;

    setTimeout(() => {

      var timer = setInterval(() => {
        if(this.time != 0) {
          this.time -=  50;
        } else {
          clearInterval(timer);
          this.nextSlide();
        }
      }, 50)},1000);
    }

    selectAnswer(answer, question){

      this.hasAnswered = true;
      answer.selected = true;
      question.flashCardFlipped = true;

      if(answer.correct){
        this.score += 3;
      }else{
        this.life--;
        this.score--;
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

    shuffle(rawAnswers: any[]): any[] {

      for (let i = rawAnswers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = rawAnswers[i];
        rawAnswers[i] = rawAnswers[j];
        rawAnswers[j] = temp;
      }

      return rawAnswers;

    }

    restartQuiz(){
      this.score = this.gScore;
      this.life = this.gLife;
      this.slides.slideTo(1, 1000);
    }

  }
