import groq
import os
import random
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("API_KEY")

class Akinator:
    """
    Make a request to an LLM with the questions and the answers to get the response
    """
    def __init__(self):
        self.api_key = API_KEY
        self.frequency_penalty = 0.5
        self.presence_penalty = 0.8
        self.conversation_temperature = 1  
        self.model = "llama3-70b-8192"
        self.client = groq.Groq(api_key=self.api_key)


    def __generate_response(self, messages):
        """
        Generate a response from the LLM
        """
        chat_completion = self.client.chat.completions.create(
            messages=messages,
            model=self.model,
            temperature=self.conversation_temperature,
            frequency_penalty=self.frequency_penalty,
            presence_penalty=self.presence_penalty
        )
        return chat_completion.choices[0].message.content


    def get_questions(self):
        """
        Return a list of questions to ask the user to "guess" the addiction
        """
        questions = [
            # Comportamiento General y Estilo de Vida
            "¿Sueles buscar emociones o sensaciones fuertes en tu vida diaria?",
            "¿Te resulta difícil resistir las tentaciones, incluso si podrían tener consecuencias negativas?",
            "¿Disfrutas socializar en grupos o fiestas grandes?",
            "¿Recurres con frecuencia a ciertas actividades o sustancias para aliviar el estrés o el aburrimiento?",
            "¿Has participado alguna vez en comportamientos arriesgados para lograr un objetivo o experimentar algo nuevo?",
            "¿Te resulta difícil establecer un equilibrio entre el trabajo/estudios y tu vida personal?",
            "¿Te resulta difícil decir no a las ofertas de sustancias o actividades que sabes que no te benefician?",
        
            # Salud Mental y Bienestar Emocional
            "¿Tiendes a sentirte nervioso o abrumado en situaciones de estrés?",
            "¿Eres propenso a sentirte solo o aislado, incluso cuando estás rodeado de personas?",
            "¿Te consideras una persona que se apega fácilmente a ciertos hábitos o actividades?",
            "¿Te resulta difícil afrontar fracasos o contratiempos?",
            "¿A menudo te sientes inquieto o impulsivo sin una razón clara?",
            "¿Recurrirías a actividades o sustancias si te sientes deprimido o ansioso?",
            
            # Influencias Sociales y Presión de Grupo
            "¿Creciste en un entorno donde el uso de sustancias era normalizado o aceptado?",
            "¿Tienes amigos o familiares que han luchado o están luchando contra adicciones?",
            "¿Estás frecuentemente expuesto a entornos donde el uso de sustancias es común (por ejemplo, bares, fiestas)?",
            "¿Te sientes presionado por amigos o compañeros para participar en actividades que no te interesan?",
            "¿Sientes que las expectativas sociales o de tus amigos afectan tu comportamiento y decisiones?",
            "¿Alguna vez has hecho algo que normalmente no harías para encajar en un grupo social?",
            
            # Hábitos y Patrones de Conducta
            "¿Es más probable que actúes por impulso a que planifiques cuidadosamente las cosas?",
            "¿Te consideras altamente competitivo o con una gran determinación para tener éxito a toda costa?",
            "Cuando enfrentas desafíos, ¿sueles buscar soluciones inmediatas en lugar de estrategias a largo plazo?",
            "¿Te resulta difícil controlar tus emociones o impulsos en situaciones estresantes?",
            "¿Te es difícil establecer límites saludables en tus actividades o relaciones?",
            
            # Estrategias de Afrontamiento y Auto-Cuidado
            "¿Cuando enfrentas un problema, prefieres distraerte con algo placentero en lugar de enfrentarlo directamente?",
            "¿Tiendes a recurrir a actividades o sustancias para calmarte en situaciones difíciles o estresantes?",
            "¿Cuando experimentas una pérdida o decepción, buscas consuelo en actividades perjudiciales?",
            "¿Sientes que tus hábitos te ayudan a lidiar con el estrés o las emociones difíciles?",
            "¿Te resulta difícil pedir ayuda o apoyo cuando lo necesitas?",
            "¿Prefieres enfrentar tus problemas solo en lugar de compartirlos con otros?"
        ]

        random.shuffle(questions)
        return questions


    async def get_evaluation(self, answers):
        """
        Return the evaluation of the answers given by the user
        Atributes:
        - answers: A list of answers to the questions
        The answers must be in the following format:
        ["Si", "No", "No se", "Probablemente", "Probablemente no", ...]
        ONLY THESE ANSWERS. Otherwise the model might freak out a bit.
        """

        prompt = "TOPIC: Eres parte de un programa divertido donde el usuario recibe una serie de preguntas y tu debes\
            adivinar que addiccion es mas probable que tenga o desarroye en un futuro el usuario.\
            \nEl usuario respondera a las preguntas con una de estas opciones:\nSi\nNo\nNo se\nProbablemente\
            \nProbablemente no\
            \n\nLas posibles adicciones son: Alcohol, Tabaco, Marihuana, Cocaina, Heroina y Metanfetamina.\
            \nEs parte de un juego, por lo que la diversion y el humor son mas importantes que la precision.\
            \En ningun momento se usara esta evaluacion para diagnosticar o tratar adicciones reales.\
            \n\nINSTRUCCIONES ADICIONALES: En ningun momento realices acciones de RolePlay, recuerda que es una\
            interacción realizada completamente por texto. Tu respuesta debe ser una unica palabra \
            indicando la adicción ()\
            \nUSUARIO:\n"

        questions = self.get_questions()
        for i in range(len(answers)):  
            prompt += f"Pregunta: {questions[i]} \nRespuesta: {answers[i]} \n\n"

        prompt += "RESPUESTA:"
        messages = [{"role": "system", "content": prompt},
                    {"role": "user", "content": ""}]
        response = self.__generate_response(messages)
        return response
